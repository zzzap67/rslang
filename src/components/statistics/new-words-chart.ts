//@ts-ignore
import { GoogleCharts } from 'google-charts';
import BaseElement from '../base-element/base-element';
import { IUserStat } from '../types/interfaces';

class NewWordsChart {
  public chartElement: HTMLElement;

  constructor(results: IUserStat[], chartType: string) {
    const chartContainer = new BaseElement('div', ['chart-container']).element;
    GoogleCharts.load(drawChart);
    this.chartElement = chartContainer;
    const chartData: [string, string | number][] = [['Дата', 'Cлова']];
    let chartTitle = 'Количество новых слов по дням';
    if (chartType === 'newWords') {
      results.forEach((result) => {
        const chartPoint: [string, string | number] = [result.dates, result.newWordAC + result.newWordSprint];
        chartData.push(chartPoint);
      });
    }
    if (chartType === 'studiedWords') {
      chartTitle = 'Количество изученных слов по дням';
      results.forEach((result) => {
        const chartPoint: [string, string | number] = [result.dates, result.studiedWord];
        chartData.push(chartPoint);
      });
    }
    function drawChart() {
      const data = GoogleCharts.api.visualization.arrayToDataTable(chartData);
      const options = {
        title: chartTitle,
        width: 600,
        height: 400,
        legend: 'none',
        vAxis: {
          baseline: 0,
        },
      };
      let chart;
      if (chartType === 'newWords') {
        chart = new GoogleCharts.api.visualization.BarChart(chartContainer);
      }
      if (chartType === 'studiedWords') {
        chart = new GoogleCharts.api.visualization.LineChart(chartContainer);
      }
      chart.draw(data, options);
    }
  }
}

export default NewWordsChart;
