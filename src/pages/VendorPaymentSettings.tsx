import React from 'react';
import PaymentSettingsTab from '@/components/companyProfile/PaymentSettingsTab';

const VendorPaymentSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Settings</h1>
          <p className="text-muted-foreground">Manage your bank account details for payment processing</p>
        </div>
      </div>

      <PaymentSettingsTab />
    </div>
  );
};

export default VendorPaymentSettings;
