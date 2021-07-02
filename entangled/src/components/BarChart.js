import React from 'react';
import Chart from 'react-google-charts';

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

        var results = [ [capitalized, ''] ];
        for (const key in data) {
            results.push([key, data[key]]);
        }

        return results;
    }

    state = {
        field_type: 'date',
        barChartData: this.collectBarChartData('date')
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
            <div id="barChartWrapper" style={{width: '90%', height:'90%', paddingLeft: "10%", paddingTop: "5%"}} >
                <Chart 
                    width={'100%'}
                    height={'100%'}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={this.state.barChartData}
                    options={{
                        title: '',
                        chartArea: { width: '50%' },
                        hAxis: {
                            title: '',
                            minValue: 0,
                        },
                        vAxis: {
                            title: barChartTitle,
                            format: '#'
                        },
                        }}
                />
                <select id="selectBarChart" onChange={this.changeData} >
                    <option value="date">Date</option>
                    <option value="language">Language</option>
                    <option value="location">Location</option>
                </select>
            </div>
            </>
        );
    }

}