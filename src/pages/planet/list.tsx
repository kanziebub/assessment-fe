import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import styles from '../../styles/planet.module.css';

import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import Link from 'next/link';

type Planet = {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
};

const MainStyled = styled.main`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 4rem 0;
`;

const List: NextPage = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>('https://swapi.dev/api/planets/');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPlanets();
  });

  const fetchPlanets = useCallback(async () => {
    try {
      if (!hasMore || loading || !nextUrl) return;

      setLoading(true);
      const response = await fetch(nextUrl);
      const data = await response.json();

      setPlanets((prevPlanets) => [...prevPlanets, ...data.results]);
      setNextUrl(data.next);
      setHasMore(!!data.next);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching planets:', error);
      setLoading(false);
    }
  }, [nextUrl, hasMore, loading]);

  const handleScroll = useCallback(
    ({ scrollOffset, scrollUpdateWasRequested }) => {
      const listHeight = 800;
      const buffer = 200;
      const isEndOfList =
        scrollOffset > 0 && scrollOffset + listHeight + buffer >= planets.length * 50;

      if (isEndOfList && !scrollUpdateWasRequested) {
        fetchPlanets();
      }
    },
    [planets.length, fetchPlanets]
  );

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>{<Link href={`/planet/${index + 1}`}>{planets[index].name}</Link>}</div>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Planet List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainStyled>
        <h1 className="text-3xl font-bold">Planet List</h1>
        <p className={styles.description} test-id="getting started">
          This list implements infinite scroll by loading more data as you scroll. A virutalized
          list library (react-window) is also used to optimize performance by recycling DOM
          elements.
        </p>
        <div className={styles.list}>
          <FixedSizeList
            height={600}
            itemCount={planets.length}
            itemSize={50}
            width={'100%'}
            onScroll={handleScroll}
          >
            {Row}
          </FixedSizeList>
          {loading && <p>Loading...</p>}
        </div>
      </MainStyled>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default List;
