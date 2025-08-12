import {
  axisFormatter,
  BulletLegendItemInterface,
  CrosshairConfig,
  LegendPosition,
} from "../../types";

export interface CandlestickDataPoint {
  date: Date | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandlestickChartProps<T extends CandlestickDataPoint> {
  /**
   * The data to be displayed in the candlestick chart.
   * Each element of the array represents a data point with OHLC values.
   */
  data: T[];

  /**
   * The width of the chart in pixels.
   */
  width: number;
  
  /**
   * The height of the chart in pixels.
   */
  height: number;
  
  /**
   * Optional label for the x-axis.
   */
  xLabel?: string;
  
  /**
   * Optional label for the y-axis.
   */
  yLabel?: string;
  
  /**
   * Optional padding applied to the chart.
   * Allows specifying individual padding values for the top, right, bottom, and left sides.
   */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  /**
   * Function to access the date value from each data point.
   * @param d - Data point
   * @returns Date or string representing the x-axis value
   */
  dateAccessor?: (d: T) => Date | string;
  
  /**
   * Function to access the open price from each data point.
   * @param d - Data point
   * @returns Number representing the open price
   */
  openAccessor?: (d: T) => number;
  
  /**
   * Function to access the high price from each data point.
   * @param d - Data point
   * @returns Number representing the high price
   */
  highAccessor?: (d: T) => number;
  
  /**
   * Function to access the low price from each data point.
   * @param d - Data point
   * @returns Number representing the low price
   */
  lowAccessor?: (d: T) => number;
  
  /**
   * Function to access the close price from each data point.
   * @param d - Data point
   * @returns Number representing the close price
   */
  closeAccessor?: (d: T) => number;
  
  /**
   * Color for bullish (up) candles when close > open.
   * @default '#10B981' (green)
   */
  bullishColor?: string;
  
  /**
   * Color for bearish (down) candles when close < open.
   * @default '#EF4444' (red)
   */
  bearishColor?: string;
  
  /**
   * Width of the candle bodies and wicks.
   * @default 0.8
   */
  candleWidth?: number;
  
  /**
   * Whether to show the tooltip on hover.
   * @default false
   */
  hideTooltip?: boolean;
  
  /**
   * Custom crosshair configuration.
   */
  crosshairConfig?: CrosshairConfig;
  
  /**
   * Whether to hide the X axis.
   * @default false
   */
  hideXAxis?: boolean;
  
  /**
   * Whether to hide the Y axis.
   * @default false
   */
  hideYAxis?: boolean;
  
  /**
   * Function to format X axis tick values.
   * @param tick - The value of the tick (Date or number)
   * @param index - The index of the tick
   * @returns Formatted string representation of the tick
   */
  xFormatter?: axisFormatter;
  
  /**
   * Function to format Y axis tick values.
   * @param tick - The value of the tick (number)
   * @param index - The index of the tick
   * @returns Formatted string representation of the tick
   */
  yFormatter?: axisFormatter;
  
  /**
   * The number of ticks to display on the X axis.
   * @default 10
   */
  xNumTicks?: number;
  
  /**
   * The number of ticks to display on the Y axis.
   * @default 10
   */
  yNumTicks?: number;
  
  /**
   * Whether to show grid lines for the X axis.
   * @default false
   */
  xGridLine?: boolean;
  
  /**
   * Whether to show grid lines for the Y axis.
   * @default true
   */
  yGridLine?: boolean;
  
  /**
   * Whether to show the domain line for the X axis.
   * @default true
   */
  xDomainLine?: boolean;
  
  /**
   * Whether to show the domain line for the Y axis.
   * @default true
   */
  yDomainLine?: boolean;
  
  /**
   * Whether to show tick lines for the X axis.
   * @default true
   */
  xTickLine?: boolean;
  
  /**
   * Whether to show tick lines for the Y axis.
   * @default true
   */
  yTickLine?: boolean;
  
  /**
   * Whether to show only min/max ticks.
   * @default false
   */
  minMaxTicksOnly?: boolean;
  
  /**
   * Custom tooltip title function.
   * @param d - Data point
   * @returns String to display as tooltip title
   */
  tooltipTitle?: (d: T) => string;
  
  /**
   * Whether to show volume bars below the candlestick chart.
   * @default false
   */
  showVolume?: boolean;
  
  /**
   * Height ratio for volume bars relative to main chart.
   * @default 0.3
   */
  volumeHeightRatio?: number;
  
  /**
   * Function to access volume from each data point.
   * @param d - Data point
   * @returns Number representing the volume
   */
  volumeAccessor?: (d: T) => number;
}
