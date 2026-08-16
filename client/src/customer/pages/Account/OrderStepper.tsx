// import { Box } from "@mui/material";
// import { useEffect, useState } from "react";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// // import { Description } from "@mui/icons-material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import { OrderStatus } from "../../../types/orderTypes";

// const steps = [
//     { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
//     { name: "Packed", description: "Item Packed in Dispatch Warehouse", value: "CONFIRMED" },
//     { name: "Shipped", description: "by Mon, 15 Jul", value: "SHIPPED" },
//     { name: "Arriving", description: "by 16 Jul - 18 Jul", value: "ARRIVING" },
//     { name: "Arrived", description: "by 16 Jul - 18 Jul", value: "DELIVERED" },
//     // { name: "Canceled", description: "by 16 Jul - 18 Jul", value: "CANCELLED" },
// ];

// const canceledStep = [
//     { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
//     { name: "Order Canceled", description: "on Thu, 11 Jul", value: "CANCELLED" },

// ];

// // const currentStep = 2; // Change this value based on the current step
// const getStepIndex = (status:any) => {
//   switch(status){
//     case "PLACED": return 0;
//     case "CONFIRMED": return 1;
//     case "SHIPPED": return 2;
//     case "OUT_FOR_DELIVERY": return 3;
//     case "DELIVERED": return 4;
//     default: return 0;
//   }
// }

// const currentStep = getStepIndex(OrderStatus);

// const OrderStepper = ({ orderStatus }: any) => {

//     const [statusStep, setStatusStep] = useState(steps);

//     useEffect(() => {

//         if (orderStatus === 'CANCELLED') {
//             setStatusStep(canceledStep)
//         } else {
//             setStatusStep(steps)
//         }

//         // setCurrentStep(orderStatus==='Canceled'? canceledStep : steps)
// // .slice(0,orderStatus==="CANCELLED"?steps.length:steps.length-1)
//     }, [orderStatus])
//     return (
//         <Box className=" mx-auto my-10">
//             {statusStep.map((step, index) => (
//                 <>
//                     <div key={index} className={` flex   px-4 `}>
//                         <div className="flex flex-col items-center">
//                             <Box
//                                 sx={{ zIndex: -1 }}
//                                 className={` w-8 h-8 rounded-full flex items-center justify-center z-10 ${index <= currentStep
//                                         ? " bg-gray-200 text-teal-500"
//                                         : "bg-gray-300 text-gray-600"
//                                     }  `}
//                             >
//                                 {step.value === orderStatus ? (
//                                     <CheckCircleIcon />
//                                 ) : (
//                                     <FiberManualRecordIcon sx={{ zIndex: -1 }} />
//                                 )}
//                             </Box>
//                             {index < statusStep.length - 1 && (
//                                 <div
//                                     className={`border h-20 w-[2px] ${index < currentStep
//                                             ? " bg-teal-500"
//                                             : "bg-gray-300 text-gray-600"
//                                         }`}
//                                 ></div>
//                             )}
//                         </div>

//                         <div className={`ml-2 w-full`}>
//                             <div
//                                 className={` ${ step.value===orderStatus
//                                         ? " bg-primary-color p-2 text-white font-medium rounded-md -translate-y-3"
//                                         : ""
//                                     } ${(orderStatus==="CANCELLED" && step.value===orderStatus)?"bg-red-500":""} w-full`}
//                             >
//                                 <p
//                                     className={`
                           
//                             `}
//                                 >
//                                     {step.name}
//                                 </p>
//                                 <p className={` ${step.value===orderStatus
//                                         ? " text-gray-200"
//                                         : "text-gray-500"
//                                     } text-xs `}>{step.description}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             ))}
//         </Box>
//     );
// };

// export default OrderStepper;


import { Box } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// const steps = [
//   { name: "Order Placed", value: "PLACED" },
//   { name: "Confirmed", value: "CONFIRMED" },
//   { name: "Shipped", value: "SHIPPED" },
//   { name: "Delivered", value: "DELIVERED" },
// ];
const steps = [
  { name: "Order Placed", value: "PLACED" },
  { name: "Confirmed", value: "CONFIRMED" },
  { name: "Packed", value: "PACKED" },
  { name: "Ready For Pickup", value: "READY_FOR_PICKUP" },
  { name: "In Transit", value: "IN_TRANSIT" },
  { name: "Delivered", value: "DELIVERED" },
];

const cancelledSteps = [
  { name: "Order Placed", value: "PLACED" },
  { name: "Cancelled", value: "CANCELLED" },
];

// const getStepIndex = (status: string) => {
//   switch (status) {
//     case "PLACED":
//       return 0;
//     case "CONFIRMED":
//       return 1;
//     case "SHIPPED":
//       return 2;
//     case "DELIVERED":
//       return 3;
//     default:
//       return 0;
//   }
// };

const getStepIndex = (status: string) => {
  switch (status) {
    case "PLACED":
      return 0;

    case "CONFIRMED":
      return 1;

    case "PACKED":
      return 2;

    case "READY_FOR_PICKUP":
      return 3;

    case "IN_TRANSIT":
      return 4;

    case "DELIVERED":
      return 5;

    default:
      return 0;
  }
};



interface Props {
  orderStatus: string;
}

const OrderStepper = ({ orderStatus }: Props) => {
  const currentStep = getStepIndex(orderStatus);

  const stepData =
    orderStatus === "CANCELLED"
      ? cancelledSteps
      : steps;

  return (
    <Box>
      {stepData.map((step, index) => (
        <div key={index} className="flex px-4">
          <div className="flex flex-col items-center">
            <Box
              className={`w-8 h-8 rounded-full flex items-center justify-center
              ${
                index <= currentStep
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index <= currentStep ? (
                <CheckCircleIcon />
              ) : (
                <FiberManualRecordIcon />
              )}
            </Box>

            {index < stepData.length - 1 && (
              <div
                className={`w-[2px] h-16 ${
                  index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>

          <div className="ml-4 pb-8">
            <h3 className="font-semibold">
              {step.name}
            </h3>
          </div>
        </div>
      ))}
    </Box>
  );
};

export default OrderStepper;