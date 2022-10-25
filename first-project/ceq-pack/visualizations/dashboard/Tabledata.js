import { useEffect,useState } from 'react';
import nrdbQuery from './lib/nrdb-query';
import {Table,TableHeader,TableHeaderCell,TableRow,TableRowCell,Dropdown, DropdownItem} from 'nr1';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
const Tabledata = (props)=>{
  console.log(props);
  const [userdata, setUserdata] = useState([]);
  const [time, setTime] = useState(1);
  const [unit, setUnit] = useState("hour");
  const units = ["minute", "hour", "day", "month"];
  const items = new Array(24).fill().map((_, i) => i + 1);

  const load = async()=>{
    const spiderQuery  = `SELECT count(*) FROM Public_APICall FACET api `;
    const allServicesData = await nrdbQuery(3653851, spiderQuery);
    return allServicesData;
  }
  const reload = async () => {
    const spiderQuery = `SELECT count(*) FROM Public_APICall FACET api SINCE ${time} ${unit} ago`;
    const allServicesData = await nrdbQuery(3653851, spiderQuery);
    console.log(spiderQuery);
    return allServicesData;
  };
  useEffect(()=>{
    reload().then(res=>{
      setUserdata(res);
    }).catch(e=>{
      console.error(e);
    });
  },[props,unit]);

  return(
    <>
    {/* <Dropdown/> */}
    <div style={{backgroundColor:'dodgerblue', color:'white', margin:'5px',padding:'5px'}}>
        <Dropdown title="SINCE" items={items}>
          {({ item, index }) => (
            <DropdownItem
              key={index}
              onClick={() => setTime(item)}
            >
              {item}
            </DropdownItem>
          )}
        </Dropdown>
        <span style={{margin:'5px',padding:'5px'}}>{time}</span>
        <Dropdown title={unit || "hour"} items={units}>
          {({ item, index }) => (
            <DropdownItem key={index} onClick={() => setUnit(item)}>
              {item}
            </DropdownItem>
          )}
        </Dropdown>
        <span style={{margin:'5px',padding:'5px'}}>ago</span>
      </div>
     <Table items={userdata}>
        <TableHeader>
          <TableHeaderCell>AppName</TableHeaderCell>
          {/* <TableHeaderCell>City</TableHeaderCell> */}
          <TableHeaderCell>Count</TableHeaderCell>
        </TableHeader>

        {({ item }) => (
          <TableRow>
            <TableRowCell>{item.api}</TableRowCell>
            {/* <TableRowCell>{item.facet}</TableRowCell> */}
            <TableRowCell>{item.count}</TableRowCell>
          </TableRow>
        )}
      </Table>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={userdata}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Pie dataKey="value" data={userdata} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </>

  )


}
export default Tabledata;
