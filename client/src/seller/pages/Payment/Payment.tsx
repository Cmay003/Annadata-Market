import { Button, Card, Divider } from '@mui/material'
import { useState, } from 'react'
import TransactionTable from './TransactionTable';
import Payouts from './PayoutsTable';
import { useAppSelector } from '../../../Redux Toolkit/Store';
import { useTranslation } from 'react-i18next';

// const tab = [
//     { name: "Transaction" },
//     // { name: "Payouts" }


// ]

const tab = [
    { key: "transaction_tab" },
    { key: "payouts_tab" }
]
const Payment = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(tab[0].key);
    const sellers  = useAppSelector((store) => store.sellers);

    const handleActiveTab = (item: any) => {
        setActiveTab(item.key);
    }
    return (
        <div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                <Card className='col-span-1 p-5 rounded-md space-y-4'>
                    <h1 className='text-gray-600 font-medium'>{t('total_earning')}</h1>
                    <h1 className='font-bold text-xl pb-1'>₹{sellers.report?.totalEarnings}</h1>
                    <Divider />
                    <p className='text-gray-600 font-medium pt-1'>{t('last_payment')} : <strong>₹0</strong></p>
                </Card>
                {/* <Card className='col-span-1 p-5 rounded-md space-y-4'>
                    <h1 className='text-gray-600 font-medium'>Payments To Be Settled</h1>
                    <h1 className='font-bold text-xl pb-1'>₹0</h1>
                    <Divider />
                    <p className='text-gray-600 font-medium pt-1'>Next Payment : <strong>₹0</strong></p>
                </Card> */}
            </div>
            <div className='mt-20'>

                {/* <div className='flex gap-4'>
                    {tab.map((item) => <Button onClick={()=>handleActiveTab(item)} variant={activeTab === item.key ? "contained" : "outlined"}>{item.key}</Button>)}

                </div> */}

                <div className='flex gap-4'>
                    {tab.map((item,key) => (
                        <Button key={key}
                            onClick={() => handleActiveTab(item)}
                            variant={activeTab === item.key ? "contained" : "outlined"}
                        >
                            {t(item.key)}
                        </Button>
                    ))}
                </div>
                <div className='mt-5'>
                    {/* {activeTab === "Transaction"? <TransactionTable /> : <Payouts />} */}
                    {activeTab === "transaction_tab" ? <TransactionTable /> : <Payouts />}
                </div>

            </div>
        </div>
    )
}

export default Payment