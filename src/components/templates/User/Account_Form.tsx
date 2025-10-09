"use client";

export default function AccountForm() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://res.cloudinary.com/do0im8hgv/image/upload/v1757949078/image_1_gmpnkd.png"
          alt=""
          className="w-[43px] h-[43px] mr-3"
        />
        <h2 className="text-xl font-semibold text-[25px]">Account Details</h2>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 gap-6 w-full font-sans-serif text-[15px]">
        {/* First Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="Sofia"
          />
        </div>

        {/* Last Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="Havertz"
          />
        </div>

        {/* Display Name */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="Sofia"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be how your name will be displayed in the account section and in reviews
          </p>
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="block font-medium mb-1 text-[#6C7275]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full border border-[#CBCBCB] rounded-md p-2"
            placeholder="sofiahavertz@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 text-[25px]">Password</h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium mb-1 text-[#6C7275]">
                Old Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full border border-[#CBCBCB] rounded-md p-2"
                placeholder="Enter old password"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#6C7275]">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full border border-[#CBCBCB] rounded-md p-2"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#6C7275]">
                Repeat New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="w-full border border-[#CBCBCB] rounded-md p-2"
                placeholder="Repeat new password"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
