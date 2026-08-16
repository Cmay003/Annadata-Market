import { useEffect, useState } from "react";
import { sellerCommissionApi } from "../../Config/appi";


interface CommissionSetting {
  platformCommissionPercent: number;
}

const CommissionInfo = () => {

  const [commission, setCommission] = useState(5);

  useEffect(() => {

    sellerCommissionApi
      .getCurrentCommission()
      .then((res) => {

        setCommission(
          res.data.platformCommissionPercent
        );

      })
      .catch(console.error);

  }, []);

  const exampleOrder = 1000;

  const commissionAmount =
    (exampleOrder * commission) / 100;

  const farmerReceives =
    exampleOrder - commissionAmount;

  return (

    <div className="space-y-6">

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-2">
          Platform Commission
        </h2>

        <p className="text-gray-600">
          Current commission set by Admin
        </p>

        <h1 className="text-5xl font-bold text-green-700 mt-4">

          {commission}%

        </h1>

      </div>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-5">

          Example Calculation

        </h2>

        <div className="space-y-3">

          <div className="flex justify-between">

            <span>Order Amount</span>

            <span>₹1000</span>

          </div>

          <div className="flex justify-between text-red-600">

            <span>
              Platform Commission ({commission}%)
            </span>

            <span>
              ₹{commissionAmount.toFixed(2)}
            </span>

          </div>

          <hr />

          <div className="flex justify-between text-green-700 font-bold text-lg">

            <span>
              Farmer Receives
            </span>

            <span>
              ₹{farmerReceives.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">

        <h3 className="font-semibold">

          Important

        </h3>

        <p>

          Delivery charges are paid by the customer.
          Farmers only pay platform commission.

        </p>

      </div>

    </div>
  );
};

export default CommissionInfo;