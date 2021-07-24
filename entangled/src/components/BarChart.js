import React from 'react';
import Chart from 'react-google-charts';
import { ResponsiveContainer, LineChart, Line, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BarChart as BarChartVisualize } from 'recharts';
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

        // var results = [[capitalized, '']];
        // for (const key in data) {
        //     results.push([key, data[key]]);
        // }

        var results = []
        for(const key in data) {
            results.push({ label:key, count:data[key] });
        }

        return results;
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

    findMaxLength = () => {
        const barChartData = this.state.barChartData;
        var res = 0;
        for(const index in barChartData) {
            res = Math.max(res, barChartData[index].label.length )
        }
        return res;
    }

    render() {
        let barChartTitle = this.capitalizeString(this.state.field_type);

        return (
            <>
                {/* <div id="barChartWrapper" style={{ width: '90%', height: '90%', paddingLeft: "10%", paddingTop: "5%" }} > */}
                    {/* <div id="barChartWrapper" style={{overflowY:"scroll", width: '100%', height:'90%'}}> */}
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChartVisualize data={this.state.barChartData} margin={{ top: 15, right: 0, bottom: 15, left: 0 }} >
                                <XAxis 
                                    dataKey="label"  
                                    interval={0}
                                    angle={-45} // force text to be 90, reading towards the graph
                                    textAnchor="end" // rather than setting "dy={50}" or something
                                    height={ Math.max(30, Math.min( 200, 6 * this.findMaxLength() ) ) }
                                />
                                <YAxis allowDecimals={false} />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#17A8F5" />
                            </BarChartVisualize>
                        </ResponsiveContainer>
                    {/* </div> */}
                    <select id="selectBarChart" onChange={this.changeData} >
                        <option value="language">{dSettings(115, this.props.userLang)}</option>
                        <option value="date">{dSettings(71, this.props.userLang)}</option>
                        <option value="location">{dSettings(121, this.props.userLang)}</option>
                    </select>
                {/* </div> */}
            </>
        );
    }

}