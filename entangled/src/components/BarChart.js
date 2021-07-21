import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
    Title,
} from '@devexpress/dx-react-chart-material-ui';
import { dSettings } from '../dictionary.js';

export default class BarChart extends React.Component {

    capitalizeString(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    collectBarChartData = (field_type) => {
        const paperData = this.props.paperData;
        var data = {};

        for (const idx in paperData) {
            if (!paperData[idx][field_type]) continue;
            if (!(paperData[idx][field_type] in data)) data[paperData[idx][field_type]] = 0;
            data[paperData[idx][field_type]]++;
        }

        var capitalized = this.capitalizeString(field_type);

        var result = []
        for(const key in data) {
            result.push({ argument:key, value:data[key] });
        }

        return result;
    }

    state = {
        field_type: 'language',
        barChartData: this.collectBarChartData('language')
    }

    changeData = () => {
        var eID = document.getElementById("selectBarChart");
        var field = eID.options[eID.selectedIndex].value;

        this.setState({ field_type: field });
        this.setState({ barChartData: this.collectBarChartData(field) });
    }

    render() {
        let barChartTitle = this.capitalizeString(this.state.field_type);

        return (
            <>
                <div id="barChartWrapper" style={{ width: '100%', height: '100%', paddingTop: "5%" }} >
                    <Paper>
                        <Chart
                            data={this.state.barChartData}
                        >
                            <ArgumentAxis />
                            <ValueAxis  />

                            <BarSeries valueField="value" argumentField="argument">
                                {/* <Label>

                                </Label> */}
                            </BarSeries>
                            <Title text={barChartTitle} />
                        </Chart>
                    </Paper>
                    <select id="selectBarChart" onChange={this.changeData} >
                        <option value="language">{dSettings(115, this.props.userLang)}</option>
                        <option value="date">{dSettings(71, this.props.userLang)}</option>
                        <option value="location">{dSettings(121, this.props.userLang)}</option>
                    </select>
                </div>
            </>
        );
    }

}