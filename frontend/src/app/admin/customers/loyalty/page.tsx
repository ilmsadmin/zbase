"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { Switch } from '@/components/ui/Switch';

export default function LoyaltyPage() {
  const { success } = useToast();
  
  // State for form values
  const [pointsPerCurrency, setPointsPerCurrency] = useState<number>(1);
  const [pointsRedeemRate, setPointsRedeemRate] = useState<number>(100);
  const [minimumPurchase, setMinimumPurchase] = useState<number>(10);
  const [welcomeBonus, setWelcomeBonus] = useState<number>(50);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isExpiring, setIsExpiring] = useState<boolean>(false);
  const [expiryPeriod, setExpiryPeriod] = useState<number>(12);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const loyaltySettings = {
      pointsPerCurrency,
      pointsRedeemRate,
      minimumPurchase,
      welcomeBonus,
      isEnabled,
      isExpiring,
      expiryPeriod: isExpiring ? expiryPeriod : null
    };
    
    // For demo purposes - would normally send to API
    console.log('Saving loyalty settings:', loyaltySettings);
    
    success("Loyalty program settings have been saved");
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loyalty Program Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Points Configuration</CardTitle>
              <CardDescription>
                Configure how customers earn and redeem loyalty points
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={isEnabled} 
                      onCheckedChange={setIsEnabled}
                    />
                    <label className="text-sm font-medium">
                      Enable loyalty program
                    </label>
                  </div>
                  
                  <hr className="border-t border-gray-200" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="pointsPerCurrency" className="text-sm font-medium">
                        Points per currency unit
                      </label>
                      <Input
                        id="pointsPerCurrency"
                        type="number"
                        min="0"
                        step="0.1"
                        value={pointsPerCurrency}
                        onChange={(e) => setPointsPerCurrency(parseFloat(e.target.value) || 0)}
                        disabled={!isEnabled}
                      />
                      <p className="text-xs text-gray-500">
                        How many points customers earn per currency unit spent
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="pointsRedeemRate" className="text-sm font-medium">
                        Points redemption rate
                      </label>
                      <Input
                        id="pointsRedeemRate"
                        type="number"
                        min="1"
                        value={pointsRedeemRate}
                        onChange={(e) => setPointsRedeemRate(parseInt(e.target.value) || 0)}
                        disabled={!isEnabled}
                      />
                      <p className="text-xs text-gray-500">
                        How many points needed to redeem 1 currency unit
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="minimumPurchase" className="text-sm font-medium">
                        Minimum purchase amount
                      </label>
                      <Input
                        id="minimumPurchase"
                        type="number"
                        min="0"
                        step="0.01"
                        value={minimumPurchase}
                        onChange={(e) => setMinimumPurchase(parseFloat(e.target.value) || 0)}
                        disabled={!isEnabled}
                      />
                      <p className="text-xs text-gray-500">
                        Minimum purchase amount to earn points
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="welcomeBonus" className="text-sm font-medium">
                        Welcome bonus points
                      </label>
                      <Input
                        id="welcomeBonus"
                        type="number"
                        min="0"
                        value={welcomeBonus}
                        onChange={(e) => setWelcomeBonus(parseInt(e.target.value) || 0)}
                        disabled={!isEnabled}
                      />
                      <p className="text-xs text-gray-500">
                        Points awarded to new customers
                      </p>
                    </div>
                  </div>
                  
                  <hr className="border-t border-gray-200" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={isExpiring} 
                        onCheckedChange={setIsExpiring}
                        disabled={!isEnabled}
                      />
                      <label className="text-sm font-medium">
                        Points expire after a period
                      </label>
                    </div>
                    
                    {isExpiring && (
                      <div className="pl-6">
                        <div className="space-y-2">
                          <label htmlFor="expiryPeriod" className="text-sm font-medium">
                            Expiry period (months)
                          </label>
                          <Input
                            id="expiryPeriod"
                            type="number"
                            min="1"
                            max="60"
                            value={expiryPeriod}
                            onChange={(e) => setExpiryPeriod(parseInt(e.target.value) || 12)}
                            disabled={!isEnabled || !isExpiring}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button type="submit" disabled={!isEnabled}>
                    Save Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Loyalty points help encourage repeat business and reward your most valuable customers.
                </p>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Current Configuration:</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Customers earn <strong>{pointsPerCurrency} points</strong> per currency unit</li>
                    <li>• <strong>{pointsRedeemRate} points</strong> = 1 currency unit in value</li>
                    <li>• New customers receive <strong>{welcomeBonus} bonus points</strong></li>
                    {isExpiring && (
                      <li>• Points expire after <strong>{expiryPeriod} months</strong></li>
                    )}
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-gray-500">
                    Note: Changes to the loyalty program settings will only affect future transactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}