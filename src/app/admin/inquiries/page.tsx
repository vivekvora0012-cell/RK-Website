import { getInquiries } from '@/app/actions/inquiryActions';
import { InquiryManager } from './InquiryManager';
import { FadeIn } from '@/components/FadeIn';
import { Inquiry } from '@/types';

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div style={{ padding: '2rem' }}>
      <FadeIn>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Message Inbox</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your client inquiries and get in touch requests.</p>
        </div>
      </FadeIn>

      <InquiryManager initialInquiries={inquiries as unknown as Inquiry[]} />
    </div>
  );
}
