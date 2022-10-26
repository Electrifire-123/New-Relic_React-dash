import { useEffect,useState } from 'react';
import nrdbQuery from './lib/nrdb-query';
import {Table,TableHeader,TableHeaderCell,TableRow,TableRowCell,Dropdown, DropdownItem} from 'nr1';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
const Tabledata = (props)=>{
  console.log(props);
  const [userdata, setUserdata] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [time, setTime] = useState(1);
  const [unit, setUnit] = useState("hour");
  const [request, setRequest] = useState("api");
  const units = ["minute", "hour", "day", "month"];
  const requests = ["api", "googleApi", "awsAPI", "awsRegion"];
  const items = new Array(24).fill().map((_, i) => i + 1);

  const load = async()=>{
    const spiderQuery  = `SELECT count(*) FROM Public_APICall FACET awsRegion `;
    const allServicesData = await nrdbQuery(3653851, spiderQuery);
    return allServicesData;
  }
  const reload = async () => {
    const spiderQuery = `SELECT count(*) FROM Public_APICall FACET ${request} SINCE ${time} ${unit} ago`;
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
  },[props,unit,time,request]);

  useEffect(()=>{
    load().then(res=>{
      console.log(res);
      setApiData(res);
    }).catch(e=>{
      console.error(e);
    });
  },[unit]);
  console.log(apiData)
  console.log(userdata)
  return(
    <>
    {/* <Dropdown/> */}
    <div style={{backgroundColor:'dodgerblue', color:'white', margin:'5px',padding:'5px'}}>
        <Dropdown title={request || "api"} items={requests}>
          {({ item, index }) => (
            <DropdownItem key={index} onClick={() => setRequest(item)}>
              {item}
            </DropdownItem>
          )}
        </Dropdown>
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
          <TableHeaderCell>Aws API</TableHeaderCell>
          <TableHeaderCell>API</TableHeaderCell>
          <TableHeaderCell>googleApi</TableHeaderCell>
          <TableHeaderCell>Count</TableHeaderCell>
          <TableHeaderCell>Aws Region</TableHeaderCell>
        </TableHeader>

        {({ item }) => (
          <TableRow>
            <TableRowCell>{item.awsAPI}</TableRowCell>
            <TableRowCell>{item.api}</TableRowCell>
            <TableRowCell>{item.googleApi}</TableRowCell>
            {/* <TableRowCell>{item.facet}</TableRowCell> */}
            <TableRowCell>{item.count}</TableRowCell>
            <TableRowCell>{item.awsRegion}</TableRowCell>
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
