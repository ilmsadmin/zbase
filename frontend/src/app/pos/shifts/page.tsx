'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import POSLayout from '@/components/layouts/POSLayout';
import { shiftsService, Shift, ShiftSummary as ShiftSummaryType } from '@/lib/api/services/shifts';
import { posService } from '@/lib/api/services/pos';
import { warehouseService, Warehouse } from '@/lib/api/services/warehouse';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import ShiftHistory from '@/components/pos/shifts/ShiftHistory';
import ShiftSummary from '@/components/pos/shifts/ShiftSummary';
import { 
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  DocumentChartBarIcon,
  ReceiptRefundIcon,
  ShoppingCartIcon,
  PencilIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

export default function POSShiftsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showOpenShiftModal, setShowOpenShiftModal] = useState(false);
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [showShiftSummary, setShowShiftSummary] = useState(false);
  const [shiftSummary, setShiftSummary] = useState<ShiftSummaryType | null>(null);
  const [showShiftHistory, setShowShiftHistory] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Open shift form state
  const [openShiftForm, setOpenShiftForm] = useState({
    warehouseId: 0,
    startAmount: 0,
    notes: ''
  });

  // Close shift form state
  const [closeShiftForm, setCloseShiftForm] = useState({
    endAmount: 0,
    notes: ''
  });

  useEffect(() => {
    checkCurrentShift();
    loadWarehouses();
  }, []);
  const checkCurrentShift = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use posService instead of shiftsService to get the most accurate shift status
      const shiftStatus = await posService.checkActiveShift();
      setActiveShift(shiftStatus.hasActiveShift ? shiftStatus.shiftData : null);
    } catch (err: any) {
      console.error('Error checking current shift:', err);
      setError(err.message || 'Failed to check current shift');
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouses = async () => {
    try {
      const data = await warehouseService.getAllWarehouses();
      setWarehouses(data);
      // Set the first warehouse as default if available
      if (data.length > 0 && openShiftForm.warehouseId === 0) {
        setOpenShiftForm(prev => ({ ...prev, warehouseId: data[0].id }));
      }
    } catch (err: any) {
      console.error('Error loading warehouses:', err);
    }
  };

  const handleOpenShift = async () => {
    try {
      if (openShiftForm.startAmount <= 0) {
        alert('Please enter a valid starting amount');
        return;
      }

      if (openShiftForm.warehouseId === 0) {
        alert('Please select a warehouse');
        return;
      }

      setLoading(true);
      const newShift = await shiftsService.createShift({
        warehouseId: openShiftForm.warehouseId,
        startAmount: openShiftForm.startAmount,
        notes: openShiftForm.notes || undefined
      });
      
      setActiveShift(newShift);
      setShowOpenShiftModal(false);
      // Reset form
      setOpenShiftForm({
        warehouseId: warehouses.length > 0 ? warehouses[0].id : 0,
        startAmount: 0,
        notes: ''
      });
    } catch (err: any) {
      console.error('Error opening shift:', err);
      alert(err.message || 'Failed to open shift');
    } finally {
      setLoading(false);
    }
  };
  const handleCloseShift = async () => {
    try {
      if (!activeShift) return;
      
      if (closeShiftForm.endAmount <= 0) {
        alert('Please enter a valid ending amount');
        return;
      }

      setLoading(true);
      const closedShift = await shiftsService.closeShift(activeShift.id, {
        endAmount: closeShiftForm.endAmount,
        notes: closeShiftForm.notes || undefined
      });
      
      // Load the shift summary
      const summary = await shiftsService.getShiftSummary(closedShift.id);
      setShiftSummary(summary);
      
      // Show the summary modal
      setShowCloseShiftModal(false);
      setShowShiftSummary(true);
      setActiveShift(null);
      
      // Reset close shift form
      setCloseShiftForm({
        endAmount: 0,
        notes: ''
      });
      
      // Double check that the shift has been closed by refreshing the current shift status
      await checkCurrentShift();
    } catch (err: any) {
      console.error('Error closing shift:', err);
      alert(err.message || 'Failed to close shift');
    } finally {
      setLoading(false);
    }
  };
  // Show shift history in modal
  const loadShiftHistory = () => {
    setShowShiftHistory(true);
  };
  const viewShiftSummary = async (shiftId: number) => {
    try {
      setLoadingSummary(true);
      const shift = await shiftsService.getShiftById(shiftId);
      setSelectedShift(shift);
      
      // Only load summary for closed shifts
      if (shift.status === 'closed') {
        const summary = await shiftsService.getShiftSummary(shiftId);
        setShiftSummary(summary);
        setShowShiftSummary(true);
      } else {
        alert('Cannot view summary for an open shift');
      }
    } catch (err: any) {
      console.error('Error loading shift summary:', err);
      alert(err.message || 'Failed to load shift summary');
    } finally {
      setLoadingSummary(false);
    }  };
  // Function to render ShiftHistory component
  const renderShiftHistory = () => {
    if (!showShiftHistory) return null;
    
    return (
      <ShiftHistory 
        onClose={() => setShowShiftHistory(false)} 
        onViewSummary={viewShiftSummary}
      />
    );
  };
  // Function to render ShiftSummary component
  const renderShiftSummary = () => {
    if (!showShiftSummary || !shiftSummary) return null;
    
    return (
      <ShiftSummary 
        shiftSummary={shiftSummary} 
        onClose={() => setShowShiftSummary(false)} 
      />
    );
  };

  if (loading && !activeShift) {
    return (
      <POSLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </POSLayout>
    );
  }

  return (
    <POSLayout>
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Shift Management</h1>
          <p className="text-gray-600">Open, close and manage your work shifts</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Current shift status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-medium mb-4">Current Shift Status</h2>
              {activeShift ? (
                <div className="space-y-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="h-6 w-6 mr-2" />
                    <span className="font-medium">Shift is active</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-2">
                        <ClockIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">Started at:</span>
                      </div>
                      <div className="font-medium">{formatDateTime(activeShift.startTime)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-2">
                        <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">Warehouse:</span>
                      </div>
                      <div className="font-medium">{activeShift.warehouse?.name}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-2">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">Starting amount:</span>
                      </div>
                      <div className="font-medium">{formatCurrency(activeShift.startAmount)}</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-500 mb-2">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm">Shift ID:</span>
                      </div>
                      <div className="font-medium">{activeShift.id}</div>
                    </div>
                  </div>
                  
                  {activeShift.notes && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="text-sm font-medium text-gray-700 mb-1">Notes:</div>
                      <div className="text-gray-600">{activeShift.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center text-red-600">
                    <XCircleIcon className="h-6 w-6 mr-2" />
                    <span className="font-medium">No active shift</span>
                  </div>
                  <p className="text-gray-600 mt-2">You need to open a shift before you can use the POS system.</p>
                </div>
              )}
            </div>
            
            <div>
              {activeShift ? (
                <button 
                  onClick={() => setShowCloseShiftModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Close Shift
                </button>
              ) : (
                <button 
                  onClick={() => setShowOpenShiftModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Open New Shift
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent shifts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h3 className="font-medium">Recent Shifts</h3>
            <div className="flex space-x-2">
              <button 
                onClick={loadShiftHistory}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
              >
                View History
              </button>
              <button 
                onClick={checkCurrentShift}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* This would be replaced with actual data in a full implementation */}
          <div className="overflow-y-auto p-6 text-gray-500 text-center flex flex-col items-center justify-center h-64">
            <CalendarIcon className="h-10 w-10 mb-3 text-gray-400" />
            <p>Your recent shifts will appear here</p>
            <p className="text-sm mt-1">Use the "Open New Shift" button to start a shift</p>
          </div>
        </div>
      </div>

      {/* Open Shift Modal */}
      {showOpenShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="font-medium text-lg">Open New Shift</h3>
              <button 
                onClick={() => setShowOpenShiftModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse
                  </label>
                  <select
                    id="warehouseId"
                    value={openShiftForm.warehouseId}
                    onChange={(e) => setOpenShiftForm(prev => ({ ...prev, warehouseId: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="0">Select Warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="startAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Cash Amount
                  </label>
                  <input
                    type="number"
                    id="startAmount"
                    value={openShiftForm.startAmount}
                    onChange={(e) => setOpenShiftForm(prev => ({ ...prev, startAmount: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={openShiftForm.notes}
                    onChange={(e) => setOpenShiftForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any notes about this shift..."
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowOpenShiftModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOpenShift}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Opening...' : 'Open Shift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Shift Modal */}
      {showCloseShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="font-medium text-lg">Close Shift</h3>
              <button 
                onClick={() => setShowCloseShiftModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="endAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Ending Cash Amount
                  </label>
                  <input
                    type="number"
                    id="endAmount"
                    value={closeShiftForm.endAmount}
                    onChange={(e) => setCloseShiftForm(prev => ({ ...prev, endAmount: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the total cash amount in the register at the end of the shift</p>
                </div>
                
                <div>
                  <label htmlFor="closeNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Closing Notes (Optional)
                  </label>
                  <textarea
                    id="closeNotes"
                    value={closeShiftForm.notes}
                    onChange={(e) => setCloseShiftForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any notes about closing this shift..."
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCloseShiftModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseShift}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Closing...' : 'Close Shift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Render ShiftHistory and ShiftSummary components */}
      {renderShiftHistory()}
      {renderShiftSummary()}
    </POSLayout>
  );
}
