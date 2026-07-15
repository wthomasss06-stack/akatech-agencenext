// app/api/assistant/report/route.js
import { GoogleGenAI } from '@google/genai'
import { Resend } from 'resend'
import Groq from 'groq-sdk'

/* ── Lazy Singletons ── */
let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')
  return _resend
}

let _genAI = null
function getGenAI() {
  if (!_genAI) _genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'placeholder' })
  return _genAI
}

let _groq = null
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' })
  return _groq
}

export async function POST(request) {
  try {
    const { messages } = await request.json()
    
    if (!messages || messages.length < 2) {
      return Response.json({ message: 'Pas assez de messages pour générer un rapport' })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[Report] RESEND_API_KEY manquante')
      return Response.json(
        { error: 'Configuration de messagerie manquante sur le serveur' },
        { status: 500 }
      )
    }

    let summary = ""
    const promptInstructions = `Fais un résumé très court (3-4 phrases maximum) de cette conversation entre notre assistant IA et un visiteur de notre site internet. Indique les points clés abordés et l'intention du visiteur s'ils sont identifiables.\n\n` + 
    messages.map(m => `${m.role === 'user' ? 'Visiteur' : 'Assistant'}: ${m.content}`).join('\n')

    // 1. TENTATIVE PRINCIPALE AVEC GEMINI
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('[Report] Tentative de résumé via Gemini...')
        const aiClient = getGenAI()
        const response = await aiClient.models.generateContent({
          model: 'gemini-1.5-flash', // Modèle performant et stable pour le résumé
          contents: [{ role: 'user', parts: [{ text: promptInstructions }] }]
        })
        summary = response.text || ""
      } catch (geminiError) {
        console.warn('[Report] Gemini en échec ou hors quota. Tentative de bascule sur Groq...', geminiError?.message ?? geminiError)
      }
    }

    // 2. TENTATIVE DE REPLI SUR GROQ (Llama 3.1 8B)
    if (!summary && process.env.GROQ_API_KEY) {
      try {
        console.log('[Report] Génération du résumé via Groq (Llama)...')
        const groqClient = getGroq()
        const chatCompletion = await groqClient.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: promptInstructions }],
          temperature: 0.5,
        })
        summary = chatCompletion.choices[0]?.message?.content || ""
      } catch (groqError) {
        console.error('[Report] Échec total lors de la génération du résumé (Gemini + Groq) :', groqError?.message ?? groqError)
      }
    }

    // S'il n'y a plus aucun moteur IA opérationnel
    if (!summary) {
      summary = "Génération du résumé impossible (Services de génération IA temporairement hors ligne ou quota de clés API épuisé)."
    }

    // 3. ENVOI DU RAPPORT PAR EMAIL (Charte sombre AKATech)
    await getResend().emails.send({
      from: process.env.FROM_EMAIL ?? 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL ?? 'wthomasss06@gmail.com',
      subject: `📝 Rapport de discussion — Assistant IA`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a120c;">
          
          <!-- Header marque -->
          <div style="padding:28px 32px;background:linear-gradient(135deg,#0d1a11 0%,#0a120c 100%);border-bottom:1px solid rgba(136,202,83,.25);">
            <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.1em;color:#88ca53;text-transform:uppercase;">
              AKATech · Rapport
            </div>
            <div style="margin-top:4px;font-size:11px;color:rgba(255,255,255,.4);">
              Résumé automatique de la session de chat
            </div>
          </div>

          <div style="padding:32px;">
            <!-- Résumé généré -->
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;">
              Résumé de la conversation
            </div>
            <p style="color:#e8e4df;line-height:1.7;font-size:14px;background:rgba(136,202,83,.05);padding:18px;border-radius:10px;border-left:3px solid #88ca53;margin:0 0 28px;">
              ${summary.replace(/\n/g, '<br>')}
            </p>

            <!-- Historique complet -->
            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px;">
              Historique complet
            </div>
            <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:20px;max-height:400px;overflow-y:auto;">
              ${messages.map(m => `
                <div style="margin-bottom:16px; border-bottom: 1px solid rgba(255,255,255,.04); padding-bottom: 12px;">
                  <strong style="color: ${m.role === 'user' ? '#88ca53' : '#f2ede8'}; font-size:12px;">
                    ${m.role === 'user' ? '👤 Visiteur :' : '🤖 Assistant :'}
                  </strong>
                  <p style="margin:6px 0 0 0; color:rgba(255,255,255,.75); font-size:13px; line-height:1.5; white-space:pre-wrap;">${m.content}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,.06);">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,.3);">
              Rapport généré par akatech-nextjs · ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Abidjan' })}
            </p>
          </div>
        </div>
      `
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[Report] Erreur lors de la génération :', error?.message ?? error)
    return Response.json({ error: 'Échec de l\'envoi du rapport' }, { status: 500 })
  }
}