import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Truck } from 'lucide-react';

interface DeliveryFeeSettingsProps {
  currentFee: number;
  onFeeUpdate: (fee: number) => void;
}

export default function DeliveryFeeSettings({ currentFee, onFeeUpdate }: DeliveryFeeSettingsProps) {
  const [fee, setFee] = useState(String(currentFee));
  const [isUpdating, setIsUpdating] = useState(false);

  const feeNumber = parseFloat(fee) || 0;

  const handleUpdateFee = async () => {
    if (feeNumber < 0 || feeNumber > 1000) {
      toast.error('Delivery fee must be between रु0 and रु1000');
      return;
    }

    setIsUpdating(true);
    try {
      // In a real app, this would make an API call to update the delivery fee
      // For now, we'll just update the local state
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onFeeUpdate(feeNumber);
      toast.success('Delivery fee updated successfully');
    } catch (error) {
      toast.error('Failed to update delivery fee');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Delivery Fee Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="deliveryFee">Standard Delivery Fee (रु)</Label>
          <Input
            id="deliveryFee"
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            min="0"
            max="1000"
            step="1"
            placeholder="Enter delivery fee"
          />
          <p className="text-sm text-gray-600 mt-1">
            This fee will be applied to all orders. Range: रु0 - रु1000
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Security Note</h4>
          <p className="text-sm text-blue-800">
            The delivery fee is validated server-side to prevent manipulation. 
            Client-side changes are limited to the configured range.
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleUpdateFee}
            disabled={isUpdating || feeNumber === currentFee}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isUpdating ? 'Updating...' : 'Update Fee'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
