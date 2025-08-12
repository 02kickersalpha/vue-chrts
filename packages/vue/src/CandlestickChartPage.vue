<script lang="ts" setup>
import { CandleStickChart } from "../lib";
import { CandlestickData, candlestickCategories } from "./data/CandlestickData";

interface CandlestickConfig {
  id: number;
  title: string;
  xGridLine: boolean;
  yGridLine: boolean;
  yDomainLine: boolean;
  xDomainLine: boolean;
  minMaxTicksOnly: boolean;
  showVolume: boolean;
  bullishColor?: string;
  bearishColor?: string;
  candleWidth?: number;
}

const config: CandlestickConfig[] = [
  {
    id: 6,
    title: "Grid Lines",
    xGridLine: true,
    yGridLine: true,
    yDomainLine: true,
    xDomainLine: true,
    minMaxTicksOnly: false,
    showVolume: true,
  },
];

// Format date for x-axis
const dateFormatter = (i: number) => {
  const date = CandlestickData[i]?.date;
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format price for y-axis
const priceFormatter = (value: number) => `$${value.toFixed(2)}`;

// Tooltip formatter
const tooltipTitle = (d: any) => {
  const date = new Date(d.date);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold mb-4">Candlestick Chart Examples</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Financial candlestick charts for displaying OHLC (Open, High, Low, Close) data. 
        Based on the D3 Observable candlestick chart implementation, perfect for stock price visualization.
      </p>
    </div>

    <!-- Chart Examples Grid -->
    <div class="flex items-center justify-center">
      <div v-for="c in config" :key="c.id" class=" rounded-lg shadow p-4">
        <h2 class="text-xl font-semibold mb-2">{{ c.title }}</h2>
        <CandleStickChart
          :data="CandlestickData"
          :width="1200"
          :height="650"
          :xGridLine="c.xGridLine"
          :yGridLine="c.yGridLine"
          :xDomainLine="c.xDomainLine"
          :yDomainLine="c.yDomainLine"
          :minMaxTicksOnly="c.minMaxTicksOnly"
          :showVolume="c.showVolume"
          :bullishColor="c.bullishColor"
          :bearishColor="c.bearishColor"
          :candleWidth="c.candleWidth"
          :xFormatter="dateFormatter"
          :yFormatter="priceFormatter"
          :tooltipTitle="tooltipTitle"
          xLabel="Date"
          yLabel="Stock Price ($)"
          :volumeHeightRatio="0.25"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Add any specific styles for the candlestick page */
</style>
