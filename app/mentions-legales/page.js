import LegalPage from '@/components/legal/LegalPage'
import { LEGAL_CONTENT } from '@/lib/legal-content'

export const metadata = { title: 'Mentions légales', description: 'Mentions légales du site AKATech Studio.', alternates: { canonical: '/mentions-legales' } }

export default function Page() { return <LegalPage contentByLanguage={LEGAL_CONTENT.mentions} /> }
