from pathlib import Path
files=[Path('/home/ubuntu/akatech-work/app/HomeClientDesktop.js'),Path('/home/ubuntu/akatech-work/app/HomeClientMobile.js')]
repls={
'"Voir le service"':"t('viewService')", "\"Voir tous les projets\"":"t('viewAllProjects')", '"Voir le projet"':"t('project_view')", '"Demander un devis"':"t('service_cta')", '"Voir tous les services"':"t('viewServices')", '"Recevoir mon devis en 24h"':"t('receiveQuote')", '"Envoyer un autre message"':"t('sendAnother')", '"Nous écrire"':"t('writeUs')", '"Votre demande a bien été reçue. On répond en moins de 24h directement par email — à très vite !"':"t('formSuccess')", '"Votre nom"':"t('yourName')", '"Votre besoin en une phrase"':"t('yourNeed')", '"Type de projet"':"t('projectTypeLabel')", '"Choisir..."':"t('chooseLabel')", '"Vos données restent confidentielles. Aucun spam."':"t('privacyNote')", '"Message envoyé !"':"t('messageSent')", '"NOS DERNIÈRES RÉALISATIONS"':"t('homeProjectsUpper')", '"CE QUE DISENT NOS CLIENTS"':"t('homeTestimonialsUpper')", '"QUESTIONS FRÉQUENTES"':"t('faqUpper')", '"OÙ INTERVENONS-NOUS ?"':"t('geoUpper')", '"DÉCRIVEZ VOTRE PROJET"':"t('formUpper')"
}
for p in files:
 s=p.read_text()
 for old,new in repls.items(): s=s.replace(old,new)
 p.write_text(s)
