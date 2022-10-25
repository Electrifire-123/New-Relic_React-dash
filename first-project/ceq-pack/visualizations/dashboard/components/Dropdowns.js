import nrdbQuery from "../lib/nrdb-query";
import { Card, CardBody, CardHeader, Dropdown, DropdownItem } from "nr1";
import { useEffect, useState } from "react";
import { useDataContextConsumer } from "../context/DataContextProvider";

export const Dropdowns = (props) => {
  const [userdata, setUserdata] = useState([]);
  const [time, setTime] = useState(1);
  const [unit, setUnit] = useState("");
  const units = ["minute", "hour", "day", "month"];
  const items = new Array(24).fill().map((_, i) => i + 1);
  const {state : {data}} = useDataContextConsumer
  console.log(data)


  const reload = async () => {
    const spiderQuery = `SELECT count(*) FROM Public_APICall FACET api SINCE ${time} ${unit} ago`;
    const allServicesData = await nrdbQuery(3653851, spiderQuery);
    console.log(spiderQuery);
    return allServicesData;
  };

  useEffect(() => {
    reload()
      .then((res) => {
        setUserdata(res);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [unit]);
  
      return (
        <>New
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
            <DropdownItem key={index} onClick={() => (setUnit(item),props.updateMethod('null',userdata))}>
              {item}
            </DropdownItem>
          )}
        </Dropdown>
        <span style={{margin:'5px',padding:'5px'}}>ago</span>
      </div>    
        </>
      );
    }