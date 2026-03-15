import { getServices } from '@/app/actions/serviceActions';
import { ServiceManager } from './ServiceManager';
import { Service } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminServices() {
  const services = (await getServices()) as unknown as Service[];

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'Playfair Display', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Manage Services</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove the industrial services offered by RK Industries.</p>
      </div>

      <ServiceManager initialServices={services} />
    </div>
  );
}
