import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProductListForStats } from '../../features/product/productSlice';
import * as d3 from 'd3';
import Spinner from '../../common/component/Spinner';
import './style/adminProduct.style.css'; //  CSS 파일 추가

const AdminProductStats = () => {
   const dispatch = useDispatch();
   const { loading, productListForStats = [] } = useSelector((state) => state.product);

   const barChartRef = useRef(null);
   const histogramRef = useRef(null);
   const stackedBarChartRef = useRef(null);
   const pieChartRef = useRef(null);

   useEffect(() => {
      dispatch(getAdminProductListForStats());
   }, [dispatch]);

   useEffect(() => {
      if (productListForStats.length > 0) {
         drawBarChart();
         drawHistogram();
         drawStackedBarChart();
         drawPieChart();
      }
   }, [productListForStats]);

   //  카테고리별 상품 개수 (막대 그래프)
   const drawBarChart = () => {
      const categoryCount = {};
      productListForStats.forEach((product) => {
         product.category.forEach((cat) => {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
         });
      });

      const data = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));

      d3.select(barChartRef.current).selectAll('*').remove();

      const width = barChartRef.current.clientWidth;
      const height = barChartRef.current.clientHeight;

      const margin = { top: 50, right: 30, bottom: 80, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(barChartRef.current).append('svg').attr('width', width).attr('height', height);

      svg.append('text')
         .attr('x', width / 2)
         .attr('y', 20)
         .attr('text-anchor', 'middle')
         .attr('class', 'chart-title')
         .text('카테고리별 상품 개수')
         .style('font-size', '22px');

      const x = d3
         .scaleBand()
         .domain(data.map((d) => d.name))
         .range([0, innerWidth])
         .padding(0.2);

      const y = d3
         .scaleLinear()
         .domain([0, d3.max(data, (d) => d.count)])
         .range([innerHeight, 0]);

      const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

      const tooltip = d3
         .select('body')
         .append('div')
         .style('position', 'absolute')
         .style('visibility', 'hidden')
         .style('background', 'white')
         .style('border', '1px solid black')
         .style('padding', '5px')
         .style('border-radius', '5px')
         .style('font-size', '26px')
         .style('pointer-events', 'none');

      g.selectAll('rect')
         .data(data)
         .enter()
         .append('rect')
         .attr('x', (d) => x(d.name))
         .attr('y', (d) => y(d.count))
         .attr('width', x.bandwidth())
         .attr('height', (d) => innerHeight - y(d.count))
         .attr('fill', 'steelblue')
         .on('mouseover', (event, d) => {
            tooltip
               .style('visibility', 'visible')
               .text(`카테고리: ${d.name}, 상품 개수: ${d.count}`)
               .style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY - 20}px`);
         })
         .on('mousemove', (event) => {
            tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 20}px`);
         })
         .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
         });

      g.append('g')
         .attr('transform', `translate(0, ${innerHeight})`)
         .call(d3.axisBottom(x).tickSize(5).tickPadding(10))
         .selectAll('text')
         .attr('transform', 'rotate(-20)')
         .style('text-anchor', 'end')
         .style('font-size', '20px');

      g.append('g').call(d3.axisLeft(y)).style('font-size', '20px');
   };

   // 상품 가격 분포
   const drawHistogram = () => {
      const prices = productListForStats.map((p) => p.price);
      const min = d3.min(prices);
      const max = d3.max(prices);
      const bins = d3.histogram().domain([min, max]).thresholds(10)(prices);

      d3.select(histogramRef.current).selectAll('*').remove();

      const width = histogramRef.current.clientWidth;
      const height = histogramRef.current.clientHeight;

      const margin = { top: 50, right: 30, bottom: 80, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(histogramRef.current).append('svg').attr('width', width).attr('height', height);

      svg.append('text')
         .attr('x', width / 2)
         .attr('y', 20)
         .attr('text-anchor', 'middle')
         .attr('class', 'chart-title')
         .text('상품 가격 분포')
         .style('font-size', '22px');

      const x = d3
         .scaleBand()
         .domain(bins.map((d) => `${Math.round(d.x0)}-${Math.round(d.x1)}`))
         .range([0, innerWidth])
         .padding(0.2);

      const y = d3
         .scaleLinear()
         .domain([0, d3.max(bins, (d) => d.length)])
         .range([innerHeight, 0]);

      const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

      const tooltip = d3
         .select('body')
         .append('div')
         .style('position', 'absolute')
         .style('visibility', 'hidden')
         .style('background', 'rgba(0, 0, 0, 0.8)')
         .style('color', 'white')
         .style('padding', '8px')
         .style('border-radius', '5px')
         .style('font-size', '26px')
         .style('pointer-events', 'none');

      g.selectAll('rect')
         .data(bins)
         .enter()
         .append('rect')
         .attr('x', (d) => x(`${Math.round(d.x0)}-${Math.round(d.x1)}`))
         .attr('y', (d) => y(d.length))
         .attr('width', x.bandwidth())
         .attr('height', (d) => innerHeight - y(d.length))
         .attr('fill', 'orange')
         .on('mouseover', (event, d) => {
            tooltip
               .style('visibility', 'visible')
               .text(`가격 범위: ${Math.round(d.x0)} - ${Math.round(d.x1)}, 상품 수: ${d.length}`)
               .style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY - 20}px`);
         })
         .on('mousemove', (event) => {
            tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 20}px`);
         })
         .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
         });

      g.append('g')
         .attr('transform', `translate(0, ${innerHeight})`)
         .call(d3.axisBottom(x).tickSize(5).tickPadding(10))
         .selectAll('text')
         .attr('transform', 'rotate(-20)')
         .style('text-anchor', 'end')
         .style('font-size', '20px');

      g.append('g').call(d3.axisLeft(y)).style('font-size', '20px');
   };

   // 카테고리 별 사이즈 별 재고
   const drawStackedBarChart = () => {
      const categoryStock = {};
      productListForStats.forEach((product) => {
         const category = product.category[0];
         if (!categoryStock[category]) {
            categoryStock[category] = { name: category, M: 0, L: 0, XL: 0, XXL: 0 };
         }
         Object.entries(product.stock || {}).forEach(([size, quantity]) => {
            categoryStock[category][size.toUpperCase()] += quantity;
         });
      });

      const data = Object.values(categoryStock);
      const keys = ['M', 'L', 'XL', 'XXL'];
      const colors = { M: '#ff7300', L: '#387908', XL: '#8884d8', XXL: '#82ca9d' };

      d3.select(stackedBarChartRef.current).selectAll('*').remove();

      const width = stackedBarChartRef.current.clientWidth;
      const height = stackedBarChartRef.current.clientHeight;

      const margin = { top: 50, right: 150, bottom: 80, left: 70 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3
         .select(stackedBarChartRef.current)
         .append('svg')
         .attr('width', width)
         .attr('height', height);

      svg.append('text')
         .attr('x', width / 2)
         .attr('y', 20)
         .attr('text-anchor', 'middle')
         .attr('class', 'chart-title')
         .style('font-size', '22px')
         .text('카테고리별 사이즈별 재고');

      const stack = d3.stack().keys(keys)(data);

      const x = d3
         .scaleBand()
         .domain(data.map((d) => d.name))
         .range([0, innerWidth])
         .padding(0.2);

      const y = d3
         .scaleLinear()
         .domain([0, d3.max(stack.flat(), (d) => d[1])])
         .range([innerHeight, 0]);

      const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

      const tooltip = d3
         .select('body')
         .append('div')
         .style('position', 'absolute')
         .style('visibility', 'hidden')
         .style('background', 'rgba(0, 0, 0, 0.8)')
         .style('color', 'white')
         .style('padding', '8px')
         .style('border-radius', '5px')
         .style('font-size', '26px')
         .style('pointer-events', 'none');

      g.selectAll('g')
         .data(stack)
         .enter()
         .append('g')
         .attr('fill', (d) => colors[d.key])
         .selectAll('rect')
         .data((d) => d)
         .enter()
         .append('rect')
         .attr('x', (d) => x(d.data.name))
         .attr('y', (d) => y(d[1]))
         .attr('height', (d) => y(d[0]) - y(d[1]))
         .attr('width', x.bandwidth())
         .on('mouseover', (event, d) => {
            tooltip
               .style('visibility', 'visible')
               .text(
                  `카테고리: ${d.data.name}, 사이즈: ${
                     d3.select(event.target.parentNode).datum().key
                  }, 재고: ${d[1] - d[0]}`,
               )
               .style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY - 20}px`);
         })
         .on('mousemove', (event) => {
            tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 20}px`);
         })
         .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
         });

      g.append('g')
         .attr('transform', `translate(0, ${innerHeight})`)
         .call(d3.axisBottom(x).tickSize(5).tickPadding(10))
         .selectAll('text')
         .attr('transform', 'rotate(-20)')
         .style('text-anchor', 'end')
         .style('font-size', '18px');

      g.append('g').call(d3.axisLeft(y)).selectAll('text').style('font-size', '20px');

      const legend = svg.append('g').attr('transform', `translate(${innerWidth + margin.left + 10}, 50)`);
      keys.forEach((key, i) => {
         legend
            .append('rect')
            .attr('x', 0)
            .attr('y', i * 20)
            .attr('width', 16)
            .attr('height', 16)
            .attr('fill', colors[key]);

         legend
            .append('text')
            .attr('x', 20)
            .attr('y', i * 20 + 10)
            .attr('font-size', '18px')
            .text(key);
      });
   };

   // 상품 활성 상태
   const drawPieChart = () => {
      const activeCount = productListForStats.filter((p) => p.status === 'active').length;
      const disactiveCount = productListForStats.filter((p) => p.status === 'disactive').length;
      const data = [
         { name: 'Active', value: activeCount },
         { name: 'Disactive', value: disactiveCount },
      ];

      d3.select(pieChartRef.current).selectAll('*').remove();

      const width = pieChartRef.current.clientWidth;
      const height = pieChartRef.current.clientHeight;
      const radius = Math.min(width, height) / 2 - 20;

      const svg = d3.select(pieChartRef.current).append('svg').attr('width', width).attr('height', height);

      svg.append('text')
         .attr('x', 20)
         .attr('y', 40)
         .attr('text-anchor', 'start')
         .attr('class', 'chart-title')
         .style('font-size', '22px')
         .style('font-weight', 'bold')
         .text('상품 활성 상태');

      const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

      const pie = d3.pie().value((d) => d.value)(data);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);
      const colors = ['#0088FE', '#FF8042'];

      const tooltip = d3
         .select('body')
         .append('div')
         .style('position', 'absolute')
         .style('visibility', 'hidden')
         .style('background', 'rgba(0, 0, 0, 0.8)')
         .style('color', 'white')
         .style('padding', '8px')
         .style('border-radius', '5px')
         .style('font-size', '26px')
         .style('pointer-events', 'none');

      g.selectAll('path')
         .data(pie)
         .enter()
         .append('path')
         .attr('d', arc)
         .attr('fill', (d, i) => colors[i])
         .on('mouseover', (event, d) => {
            tooltip
               .style('visibility', 'visible')
               .text(`${d.data.name}: ${d.data.value}`)
               .style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY - 20}px`);
         })
         .on('mousemove', (event) => {
            tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 20}px`);
         })
         .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
         });
   };

   if (loading) {
      return <Spinner />;
   }

   return (
      <div className='chart-container'>
         <div className='chart-box' ref={barChartRef}></div>
         <div className='chart-box' ref={histogramRef}></div>
         <div className='chart-box' ref={stackedBarChartRef}></div>
         <div className='chart-box' ref={pieChartRef}></div>
      </div>
   );
};

export default AdminProductStats;
