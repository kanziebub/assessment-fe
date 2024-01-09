import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import styles from '../../styles/planet.module.css';
import { useRouter } from 'next/router';
import { useWishlist } from 'context/wishlist';

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

const Wishlist = () => {
  const [loading, setLoading] = useState(false);
  const { wishlist } = useWishlist();
  const [planets, setPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    fetchPlanetsByIds(wishlist);
  }, [wishlist]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = planets.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchPlanetsByIds = async (wishlist: string[]) => {
    const planets = [];

    for (const id of wishlist) {
      try {
        setLoading(true);
        const response = await fetch(`https://swapi.dev/api/planets/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch planet');
        }
        const planet = await response.json();
        planets.push(planet);
      } catch (error) {
        console.error(`Error fetching planet with ID ${id}:`, error);
        setLoading(false);
      }
    }

    setPlanets(planets);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Wishlist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainStyled>
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className={styles.description} test-id="getting started">
          This wishlist implements pagination and data is shown by a certain number of limit for
          each page. Select the page you wish to see on the bottom of the box.
        </p>
        <div className={styles.list}>
          <div className={styles.page}>
            {loading && <p>Loading...</p>}
            {!loading &&
              currentItems.map((planet, index) => (
                <div key={index} className={styles.wl_item}>
                  <p>{planet.name}</p>
                </div>
              ))}
          </div>
          <div>
            {Array.from({ length: Math.ceil(wishlist.length / itemsPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`${styles.paginator} ${
                  currentPage === index + 1 ? styles.activePage : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
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

export default Wishlist;
