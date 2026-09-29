import Link from 'next/link';
import { Button } from '../components/ui/button/button';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello dashboard</h1>
      <Link href={'/'}>
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
