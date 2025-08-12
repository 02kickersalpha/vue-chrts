<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import * as d3 from "d3";
import {
  CandlestickChartProps,
  CandlestickDataPoint,
} from "./types";

const props = withDefaults(defineProps<CandlestickChartProps<CandlestickDataPoint>>(), {
  width: 500,
  bullishColor: "#10B981",
  bearishColor: "#EF4444",
  candleWidth: 0.8,
  hideTooltip: false,
  hideXAxis: false,
  hideYAxis: false,
  xNumTicks: 10,
  yNumTicks: 10,
  xGridLine: false,
  yGridLine: true,
  xDomainLine: true,
  yDomainLine: true,
  xTickLine: true,
  yTickLine: true,
  minMaxTicksOnly: false,
  showVolume: false,
  volumeHeightRatio: 0.3,
  padding: () => ({ top: 20, right: 20, bottom: 30, left: 50 }),
  dateAccessor: (d) => d.date,
  openAccessor: (d) => d.open,
  highAccessor: (d) => d.high,
  lowAccessor: (d) => d.low,
  closeAccessor: (d) => d.close,
  volumeAccessor: (d) => d.volume || 0,
});

const svgRef = ref<SVGSVGElement | null>(null);

const drawChart = () => {
  if (!svgRef.value) return;

  const svg = d3.select(svgRef.value);
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const { top, right, bottom, left } = props.padding;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const mainChartHeight = props.showVolume
    ? chartHeight * (1 - props.volumeHeightRatio)
    : chartHeight;

  const g = svg
    .append("g")
    .attr("transform", `translate(${left},${top})`);

  const x = d3
    .scaleBand()
    .domain(props.data.map(props.dateAccessor).map(d => new Date(d).toISOString()))
    .range([0, chartWidth])
    .padding(props.candleWidth);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(props.data, props.lowAccessor)!,
      d3.max(props.data, props.highAccessor)!,
    ])
    .range([mainChartHeight, 0]);

  const xAxis = d3.axisBottom(x).ticks(props.xNumTicks).tickFormat(props.xFormatter);
  const yAxis = d3.axisLeft(y).ticks(props.yNumTicks).tickFormat(props.yFormatter);

  if (!props.hideXAxis) {
    const xAxisGroup = g.append("g")
      .attr("transform", `translate(0,${mainChartHeight})`)
      .call(xAxis);
    
    // X Domain Line
    if (!props.xDomainLine) {
      xAxisGroup.select(".domain").remove();
    } else {
      xAxisGroup.select(".domain")
        .attr("stroke", "var(--vis-axis-grid-color)")
        .attr("stroke-width", 5);
    }
    
    // X Tick Lines
    if (!props.xTickLine) {
      xAxisGroup.selectAll(".tick line").remove();
    }
  }

  if (!props.hideYAxis) {
    const yAxisGroup = g.append("g").call(yAxis);
    
    // Y Domain Line
    if (!props.yDomainLine) {
      yAxisGroup.select(".domain").remove();
    } else {
      yAxisGroup.select(".domain")
        .attr("stroke", "var(--vis-axis-grid-color)")
        .attr("stroke-width", 1);
    }
    
    // Y Tick Lines
    if (!props.yTickLine) {
      yAxisGroup.selectAll(".tick line").remove();
    }
  }

  // X Grid Lines
  if (props.xGridLine) {
    g.append("g")
      .attr("class", "x-grid")
      .attr("transform", `translate(0,${mainChartHeight})`)
      .call(
        d3.axisBottom(x)
          .ticks(props.xNumTicks)
          .tickSize(-mainChartHeight)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "var(--vis-axis-grid-color)")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);
  }

  // Y Grid Lines
  if (props.yGridLine) {
    g.append("g")
      .attr("class", "y-grid")
      .call(
        d3.axisLeft(y)
          .ticks(props.yNumTicks)
          .tickSize(-chartWidth)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "var(--vis-axis-grid-color)")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);
  }

  // Candlesticks
  const candlesticks = g.append("g").attr("class", "candlesticks");

  candlesticks
    .selectAll("rect")
    .data(props.data)
    .join("rect")
    .attr("x", (d) => x(new Date(props.dateAccessor(d)).toISOString())!)
    .attr("y", (d) => y(Math.max(props.openAccessor(d), props.closeAccessor(d))))
    .attr("width", x.bandwidth())
    .attr("height", (d) => Math.abs(y(props.openAccessor(d)) - y(props.closeAccessor(d))))
    .attr("fill", (d) =>
      props.closeAccessor(d) >= props.openAccessor(d)
        ? props.bullishColor
        : props.bearishColor
    );

  // Wicks
  candlesticks
    .selectAll("line.wick")
    .data(props.data)
    .join("line")
    .attr("class", "wick")
    .attr("x1", (d) => x(new Date(props.dateAccessor(d)).toISOString())! + x.bandwidth() / 2)
    .attr("x2", (d) => x(new Date(props.dateAccessor(d)).toISOString())! + x.bandwidth() / 2)
    .attr("y1", (d) => y(props.highAccessor(d)))
    .attr("y2", (d) => y(props.lowAccessor(d)))
    .attr("stroke", (d) =>
      props.closeAccessor(d) >= props.openAccessor(d)
        ? props.bullishColor
        : props.bearishColor
    );

  // Volume chart
  if (props.showVolume) {
    const volumeHeight = chartHeight * props.volumeHeightRatio - top;
    const volumeY = d3
      .scaleLinear()
      .domain([0, d3.max(props.data, props.volumeAccessor)!])
      .range([volumeHeight, 0]);

    const volumeG = g
      .append("g")
      .attr("transform", `translate(0,${mainChartHeight + top})`);

    volumeG
      .selectAll("rect")
      .data(props.data)
      .join("rect")
      .attr("x", (d) => x(new Date(props.dateAccessor(d)).toISOString())!)
      .attr("y", (d) => volumeY(props.volumeAccessor(d)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => volumeHeight - volumeY(props.volumeAccessor(d)))
      .attr("fill", (d) =>
        props.closeAccessor(d) >= props.openAccessor(d)
          ? props.bullishColor
          : props.bearishColor
      );
  }
};

onMounted(drawChart);
watch(() => props, drawChart, { deep: true });
</script>

<template>
  <svg ref="svgRef" :width="width" :height="height"></svg>
</template>
