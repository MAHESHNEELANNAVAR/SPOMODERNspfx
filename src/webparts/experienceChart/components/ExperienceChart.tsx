import * as React from 'react';
import { DonutChart, IChartDataPoint, DataVizPalette, getColorFromToken } from '@fluentui/react-charting';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Toggle } from '@fluentui/react/lib/Toggle';

interface IExperienceChartState {
  chartData: IChartDataPoint[];
  enableGradient: boolean;
  roundCorners: boolean;
  legendMultiSelect: boolean;
  totalYearsOfExperience: number;  
}

interface IExperienceChartProps {
  siteUrl: string;
  spHttpClient: SPHttpClient;
}

class ExperienceChart extends React.Component<IExperienceChartProps, IExperienceChartState> {
  constructor(props: IExperienceChartProps) {
    super(props);

    this.state = {
      chartData: [],
      enableGradient: false,
      roundCorners: false,
      legendMultiSelect: false,
      totalYearsOfExperience: 0,  
    };
  }

  public componentDidMount(): void {
    this.fetchChartData();
  }

  private fetchChartData(): void {
    const listUrl = `${this.props.siteUrl}/_api/web/lists/getbytitle('EmployeeExperience')/items`;

    
    this.props.spHttpClient?.get(listUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then((data: any) => {
        
        let totalExperience = 0;
        const chartData = data.value.map((item: any) => {
          
          const yearsOfExperience = Math.round(item.YearsOfExperience || 0); 
          totalExperience += yearsOfExperience; 

          return {
            legend: `${item.Title || 'Unknown'} - ${yearsOfExperience} years`,
            data: yearsOfExperience,
            color: getColorFromToken(DataVizPalette.color1),
          };
        });

    
        const totalExperienceFormatted = totalExperience.toFixed(2);

        this.setState({
          chartData,
          totalYearsOfExperience: parseFloat(totalExperienceFormatted),  
        });
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }

  private _onToggleGradient = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
    this.setState({ enableGradient: checked });
  };

  private _onToggleRoundCorners = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
    this.setState({ roundCorners: checked });
  };

  private _onToggleLegendMultiSelect = (ev: React.MouseEvent<HTMLElement>, checked: boolean) => {
    this.setState({ legendMultiSelect: checked });
  };

  public render(): JSX.Element {
    const { chartData, enableGradient, roundCorners, legendMultiSelect, totalYearsOfExperience } = this.state;

    const data = {
      chartTitle: 'Employee Experience Chart',
      chartData: chartData,
    };

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <Toggle
            label="Enable Gradient"
            onText="ON"
            offText="OFF"
            onChange={this._onToggleGradient}
            checked={enableGradient}
          />
          &nbsp;&nbsp;
          <Toggle
            label="Rounded Corners"
            onText="ON"
            offText="OFF"
            onChange={this._onToggleRoundCorners}
            checked={roundCorners}
          />
          &nbsp;&nbsp;
          <Toggle
            label="Select Multiple Legends"
            onText="ON"
            offText="OFF"
            onChange={this._onToggleLegendMultiSelect}
            checked={legendMultiSelect}
          />
        </div>

        <DonutChart
          culture={window.navigator.language}
          data={data}
          innerRadius={55}
          href={'https://developer.microsoft.com/en-us/'}
          legendsOverflowText={'Companies Approximate Work Experience'}
          hideLegend={false}
          valueInsideDonut={`${totalYearsOfExperience} YoE`} 
          enableGradient={enableGradient}
          roundCorners={roundCorners}
          legendProps={{
            canSelectMultipleLegends: legendMultiSelect,
          }}
        />
      </div>
    );
  }
}
export default ExperienceChart;
