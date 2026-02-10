import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Truck, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { createDeliveryFee, deleteDeliveryFee, fetchDeliveryFee, updateDeliveryFee } from '@/features/delivery/deliverySlice';
interface DeliveryFeeSettingsProps {
  currentFee: number;
  onFeeUpdate: (fee: number) => void;
}

export default function DeliveryFeeSettings({ currentFee, onFeeUpdate }: DeliveryFeeSettingsProps) {
  const dispatch = useAppDispatch();
  const { fees, loading: feeLoading, error: feeError } = useAppSelector((state) => state.delivery);
  const [fee, setFee] = useState(String(currentFee));
  const [isUpdating, setIsUpdating] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('edit');
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const feeNumber = parseFloat(fee) || 0;
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const activeFee = fees.find((item) => item.status === "active");
  const selectedFee = editingFeeId ? fees.find((item) => item.id === editingFeeId) : undefined;
  useEffect(() => {
    dispatch(fetchDeliveryFee());
  }, [dispatch]);

  useEffect(() => {
    if (!feeLoading && !feeError) {
      if (activeFee) {
        onFeeUpdate(activeFee.fee);
      } else {
        onFeeUpdate(0);
      }
    }
  }, [feeLoading, feeError, activeFee, onFeeUpdate]);

  const handleSaveFee = async () => {

    if (feeNumber < 0 || feeNumber > 1000) {
      toast.error('Please enter a fee between रु0 and रु1000');
      return;
    }

    setIsUpdating(true);
    try {
      if (mode === 'add') {
        await dispatch(createDeliveryFee({ fee: feeNumber, status: "active" })).unwrap();
      } else {
        if (!editingFeeId) {
          toast.error('Select a fee to edit');
          return;
        }
        await dispatch(updateDeliveryFee({ fee: feeNumber, status, id: editingFeeId })).unwrap();
      }
      onFeeUpdate(feeNumber);
      toast.success('Delivery fee updated successfully');
    } catch (error) {
      toast.error('Failed to update delivery fee');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMode = () => {
    setMode('add');
    setEditingFeeId(null);
    setFee('');
    setStatus('active');
  };

  const handleEdit = (id?: string) => {
    if (!id) return;
    const target = fees.find((item) => item.id === id);
    if (!target) return;
    setMode('edit');
    setEditingFeeId(id);
    setFee(String(target.fee));
    setStatus(target.status);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this delivery fee?')) return;
    try {
      await dispatch(deleteDeliveryFee(id)).unwrap();
      toast.success('Delivery fee deleted');
      if (editingFeeId === id) {
        setEditingFeeId(null);
        setMode('add');
        setFee('');
        setStatus('active');
      }
    } catch (error) {
      toast.error('Failed to delete delivery fee');
    }
  };

  const showForm = mode === 'add' || (mode === 'edit' && !!selectedFee);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery Fee Settings
          </CardTitle>
          <Button onClick={handleAddMode} className="gap-2 rounded-full">
            <Plus className="w-4 h-4" />
            Add Fee
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white/70 overflow-hidden">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.6fr_auto] gap-4 px-4 py-3 text-sm font-medium text-slate-600 bg-slate-50">
            <span>Fee</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          {feeLoading ? (
            <div className="px-4 py-4 text-sm text-slate-600">Loading…</div>
          ) : fees.length === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-600">No delivery fees found.</div>
          ) : (
            fees.map((item) => (
              <div key={item.id} className="grid grid-cols-[1.2fr_0.8fr_0.6fr_auto] gap-4 px-4 py-4 items-center text-sm text-slate-700 border-t border-slate-100">
                <span>Standard Delivery Fee</span>
                <span>रु{item.fee.toFixed(2)}</span>
                <span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {item.status === "active" ? "Active" : "Inactive"}
                  </span>
                </span>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-center">
            <Label htmlFor="deliveryFee">
              {mode === 'add' ? 'Add Delivery Fee (रु)' : 'Edit Delivery Fee (रु)'}
            </Label>
            <div className='flex  items-center gap-2 text-sm text-slate-600 justify-between w-full '>
              <div className="w-full">
 <Label htmlFor="deliveryFee">Fee</Label>
                <input
                  id="deliveryFee"
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  min="0"
                  max="1000"
                  step="1"
                  placeholder="Enter delivery fee"
                  disabled={feeLoading}
                  className="w-full mt-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-green-500 disabled:opacity-60"
                />

              </div>

              <div className="w-full lg:w-56">
                <Label htmlFor="deliveryStatus">Status</Label>
                <select
                  id="deliveryStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                  className="w-full mt-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>  <p className="text-sm text-gray-600 mt-1">
              This fee will be applied to all orders. Range: रु0 - रु1000
            </p>
            <div className="flex w-full lg:w-auto justify-start lg:justify-center items-center">
              <Button
                onClick={handleSaveFee}
                disabled={isUpdating || (mode === 'edit' && !selectedFee) || feeNumber === (selectedFee?.fee ?? currentFee)}
                variant="outline"
                size="sm"
                className="gap-2 rounded-full w-full lg:w-auto"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Saving...' : mode === 'add' ? 'Add Fee' : 'Update Fee'}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Security Note</h4>
          <p className="text-sm text-blue-800">
            The delivery fee is validated server-side to prevent manipulation.
            Client-side changes are limited to the configured range.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
