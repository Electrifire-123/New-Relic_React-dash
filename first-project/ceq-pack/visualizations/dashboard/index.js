import React from 'react';
import {RadarChart,PolarGrid,PolarAngleAxis,PolarRadiusAxis,Radar} from 'recharts'
import {Card, CardBody, HeadingText, NrqlQuery, Spinner, AutoSizer,Grid,GridItem,Button  } from 'nr1';
// import Customgraph from './widgets/Customgraph';
// import Spiderchart from './widgets/Spiderchart';
import Responsedata from './Responsedata';
import Tabledata from './Tabledata';

export default class DemoPracCeqVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = { httpType: '' };
    this.data = { data : []}
    this.updateMethod = this.updateMethod.bind(this)
  }

  updateMethod (value){
    this.setState({httpType: value});
  }

    render() {
        return (
          <>
            <AutoSizer>
                {({width, height}) => (
                    <>
                    <Responsedata updateMethod={this.updateMethod}/>
                    {
                      (this.state.httpType !=='')
                      ?
                        <Tabledata httptype = {this.state.httpType}/>
                      :<Spinner/>
                    }
                    </>
                )}
            </AutoSizer>
          </>
        );
    }
}


const ErrorState = () => (
    <Card className="ErrorState">
        <CardBody className="ErrorState-cardBody">
            <HeadingText
                className="ErrorState-headingText"
                spacingType={[HeadingText.SPACING_TYPE.LARGE]}
                type={HeadingText.TYPE.HEADING_3}
            >
                Oops! Something went wrong.
            </HeadingText>
        </CardBody>
    </Card>
);
