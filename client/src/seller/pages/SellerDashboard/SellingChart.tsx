import  { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchRevenueChart } from '../../../Redux Toolkit/Seller/revenueChartSlice';


const SellingChart = ({chartType}:{chartType:string}) => {
  const dispatch=useAppDispatch()
  const {revenueChart}=useAppSelector(store=>store)

  useEffect(()=>{
    if(chartType){
      dispatch(fetchRevenueChart({type:chartType}))
    }
    
  },[chartType])
    // console.log("daily revenue chart ****** ",revenueChart.dailyRevenue)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={revenueChart.chart}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00927c" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00927c" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f5f0" />
          <XAxis dataKey="date" stroke="#00927c" style={{ fontSize: 12, fontWeight: 500 }} />
          <YAxis dataKey={"revenue"} stroke="#00927c" style={{ fontSize: 12, fontWeight: 500 }} />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#00927c" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  
}

export default SellingChart;