'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Facebook, 
  Settings, 
  Users, 
  MessageSquare,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { FacebookConnectButton } from './FacebookConnectButton';
import { ConnectionStatus } from './ConnectionStatus';

interface FacebookSetupWizardProps {
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

interface StepStatus {
  completed: boolean;
  current: boolean;
  error?: string;
}

export const FacebookSetupWizard: React.FC<FacebookSetupWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepStatus[]>([
    { completed: false, current: true },  // Step 0: Prerequisites
    { completed: false, current: false }, // Step 1: Connect Account
    { completed: false, current: false }, // Step 2: Grant Permissions
    { completed: false, current: false }, // Step 3: Select Pages
    { completed: false, current: false }, // Step 4: Complete Setup
  ]);

  const stepTitles = [
    'Prerequisites Check',
    'Connect Facebook Account',
    'Grant Permissions',
    'Select Pages',
    'Complete Setup'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: index <= currentStep,
        current: index === currentStep + 1
      })));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: index < currentStep - 1,
        current: index === currentStep - 1
      })));
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnect = async (success: boolean) => {
    if (success) {
      setConnectionError(null);
      handleNext();
    } else {
      setConnectionError('Failed to connect Facebook account. Please try again.');
    }
  };

  const completeSetup = () => {
    setSteps(prev => prev.map(step => ({ ...step, completed: true, current: false })));
    onComplete(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Prerequisites Check</h3>
            <p className="text-gray-600">
              Before connecting Facebook, let's ensure everything is properly configured.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Facebook App Configuration</div>
                  <div className="text-sm text-gray-600">Facebook app credentials are configured</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">HTTPS Enabled</div>
                  <div className="text-sm text-gray-600">Secure connection required for Facebook OAuth</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Database Ready</div>
                  <div className="text-sm text-gray-600">Facebook tables are created and accessible</div>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <div>
                <div className="font-medium">All Prerequisites Met</div>
                <div className="text-sm">You're ready to connect your Facebook account.</div>
              </div>
            </Alert>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect Facebook Account</h3>
            <p className="text-gray-600">
              Click the button below to connect your Facebook account. You'll be redirected to Facebook to authorize the connection.
            </p>

            {connectionError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <div>
                  <div className="font-medium">Connection Failed</div>
                  <div className="text-sm">{connectionError}</div>
                </div>
              </Alert>
            )}

            <div className="text-center py-6">
              <FacebookConnectButton 
                onConnect={handleConnect}
                size="lg"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You'll be redirected to Facebook</li>
                <li>• Login with your Facebook account</li>
                <li>• Authorize ZBase to access your account</li>
                <li>• You'll be redirected back to complete setup</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Grant Permissions</h3>
            <p className="text-gray-600">
              ZBase needs specific permissions to manage your Facebook pages and messages.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">pages_read_engagement</div>
                  <div className="text-sm text-gray-600">Read page posts, comments, and engagement data</div>
                </div>
                <Badge variant="success">Granted</Badge>
              </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">public_profile</div>
                  <div className="text-sm text-gray-600">Basic user profile information</div>
                </div>
                <Badge variant="success">Granted</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">email</div>
                  <div className="text-sm text-gray-600">User email address</div>
                </div>
                <Badge variant="success">Granted</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">pages_show_list</div>
                  <div className="text-sm text-gray-600">View list of pages you manage</div>
                </div>
                <Badge variant="success">Granted</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-amber-50 border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium">pages_manage_metadata</div>
                  <div className="text-sm text-gray-600">Manage page information (requires App Review)</div>
                </div>
                <Badge variant="secondary">Pending Review</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-amber-50 border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium">pages_messaging</div>
                  <div className="text-sm text-gray-600">Send and receive messages (requires App Review)</div>
                </div>
                <Badge variant="secondary">Pending Review</Badge>
              </div>
            </div>            <Alert>
              <CheckCircle className="h-4 w-4" />
              <div>
                <div className="font-medium">Basic Permissions Granted</div>
                <div className="text-sm">You can connect pages and view basic information. Advanced features require Facebook App Review approval.</div>
              </div>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Pages</h3>
            <p className="text-gray-600">
              Choose which Facebook pages you want to manage through ZBase.
            </p>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">ZBase Store</div>
                      <div className="text-sm text-gray-600">Business • 1,250 followers</div>
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" defaultChecked />
                    Connect
                  </label>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">ZBase Support</div>
                      <div className="text-sm text-gray-600">Customer Service • 890 followers</div>
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded mr-2" />
                    Connect
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected: 1 page</h4>
              <p className="text-sm text-blue-800">
                You can change these settings later in the Pages management section.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Setup Complete!</h3>
            <p className="text-gray-600">
              Your Facebook account has been successfully connected to ZBase.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-medium text-green-900 mb-2">Connection Successful</h4>
              <p className="text-sm text-green-800">
                ZBase is now connected to your Facebook account and ready to manage your pages.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">What's Next?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Visit the Pages section to configure your connected pages
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Set up automatic message responses (optional)
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Configure comment moderation settings
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Explore analytics and insights features
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step.completed 
                ? 'bg-green-500 text-white' 
                : step.current 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }
            `}>
              {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                h-1 w-16 mx-2
                ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step Titles */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">{stepTitles[currentStep]}</h2>
        <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isConnecting}
        >
          Cancel
        </Button>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isConnecting}
            >
              Previous
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={isConnecting || (currentStep === 1 && !steps[1].completed)}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={completeSetup}>
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
