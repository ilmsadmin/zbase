import React from 'react';
import { PageContainer } from '@/components/ui';
import { Section } from '@/components/ui';

export default function PublicLayoutTestPage() {
  return (
    <PageContainer>
      <Section
        title="Public Layout Test"
        description="This page demonstrates the responsive public layout with header and footer"
        className="py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-2">Feature {item}</h3>
              <p className="text-gray-600">
                This is a demonstration of the public layout with the responsive header 
                and footer components. Try resizing your browser window to see how the 
                layout adapts to different screen sizes.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Navigation Features"
        description="Testing the mobile and desktop navigation components"
        className="py-12 bg-gray-50"
      >
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-medium mb-2">Desktop Navigation</h3>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Responsive navigation menu</li>
              <li>Active link highlighting</li>
              <li>Dropdown submenus for Solutions section</li>
              <li>Consistent branding and styling</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-medium mb-2">Mobile Navigation</h3>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Hamburger menu toggle</li>
              <li>Sliding menu panel</li>
              <li>Expandable dropdown sections</li>
              <li>Optimized for touch interaction</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
            <h3 className="text-lg font-medium mb-2">Footer Features</h3>
            <ul className="list-disc ml-6 text-gray-600">
              <li>Multiple column layout with organized links</li>
              <li>Social media icons</li>
              <li>Copyright information</li>
              <li>Responsive design for all screen sizes</li>
            </ul>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
}
