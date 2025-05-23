import { Card } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';

interface ReportCategoryProps {
  name: string;
  description: string;
  icon: string;
  href: string;
}

export default function ReportCategory({ name, description, icon, href }: ReportCategoryProps) {
  return (
    <Link href={href} className="block">
      <Card className="h-full p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Image src={icon} alt={name} width={24} height={24} />
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
