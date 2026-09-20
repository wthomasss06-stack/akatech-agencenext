import LegalPage from '@/components/legal/LegalPage'
import { LEGAL_CONTENT } from '@/lib/legal-content'

export const metadata = { title: 'Conditions générales d’utilisation', description: 'Conditions générales d’utilisation du site AKATech Studio.', alternates: { canonical: '/conditions-utilisation' } }

export default function Page() { return <LegalPage contentByLanguage={LEGAL_CONTENT.terms} /> }
