import LegalPage from '@/components/legal/LegalPage'
import { LEGAL_CONTENT } from '@/lib/legal-content'

export const metadata = { title: 'Politique de confidentialité', description: 'Politique de confidentialité et de protection des données d’AKATech Studio.', alternates: { canonical: '/confidentialite' } }

export default function Page() { return <LegalPage contentByLanguage={LEGAL_CONTENT.privacy} /> }
