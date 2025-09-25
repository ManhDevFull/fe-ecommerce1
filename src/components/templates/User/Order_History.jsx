"use client";

export default function OrderHistory() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold text-[25px]">Order History</h2>
      </div>

      <div className="space-y-4">
        {/* Replace with real list later */}
        <div className="border border-[#E5E7EB] rounded-md p-4">
          <p className="font-medium">Order #12345</p>
          <p className="text-sm text-gray-600">Placed: 2025-09-01 — Total: $45.00</p>
        </div>
      </div>
    </div>
  );
}
