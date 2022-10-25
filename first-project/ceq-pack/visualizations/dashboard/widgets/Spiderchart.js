import {Card, CardBody, CardHeader,NrqlQuery,Spinner} from 'nr1';
import {RadarChart,PolarGrid,PolarAngleAxis,PolarRadiusAxis,Radar} from 'recharts';

class Spiderchart extends React.Component {

  processSpiderData = (rawData)=>{
    return rawData.map((entry) => ({
        name: entry.metadata.name,
        count: entry.data[0].y,
        color:entry.metadata.color
    }));
  }

  render(){
    const spiderQuery  = `SELECT count(*) FROM Public_APICall FACET http.method `;
    return(
      <NrqlQuery
        query ={spiderQuery}
        accountId={3653851}
        pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
      >

      {({data, loading, error}) => {
        if (loading) {
          return <Spinner />;
        }
        if (error) {
            return <Spinner />;
        }
        console.log('processSpiderData 1');
        console.log(data);
        const processData = this.processSpiderData(data);
        console.log('processSpiderData 2');
        console.log(processData);
        return(
          <div className="nr1-RedBox">
            <Card className="chart-card">
              <CardHeader className="chart-card-heading" title="Top 10 Transactions"/>
              <CardBody>
                  <RadarChart height={350} width={500} outerRadius="80%" data={processData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis stroke="#0C87F4"/>
                      <Radar dataKey="count" stroke="green"
                          fill="green" fillOpacity={0.5} />
                  </RadarChart>
                  <div className='chart-card-subheading'>Top 10 Transactions for 1 hours</div>
              </CardBody>
            </Card>
          </div>
        )
      }}
    </NrqlQuery>
    )
  }
}

export default Spiderchart;