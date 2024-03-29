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

function formatDate(dateStr: String) {
  const date = new Date(String(dateStr));
  return date.toLocaleString();
}

const Detail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const validId = id as string;

  const planetUrl = `https://swapi.dev/api/planets/${id}/`;
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState(false);

  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const isPlanetInWishlist = wishlist.includes(validId);

  const handleWishlistClick = () => {
    if (isPlanetInWishlist) {
      removeFromWishlist(validId);
    } else {
      addToWishlist(validId);
    }
  };

  useEffect(() => {
    const fetchPlanetDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(planetUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPlanet(data as Planet);
      } catch (error) {
        console.error('Error fetching planet details:', error);
        return null;
      }
      setLoading(false);
    };

    fetchPlanetDetail();
  }, [id, planetUrl]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainStyled>
        {loading && <p>Loading...</p>}
        {!loading && planet && (
          <>
            <h1 className="text-3xl font-bold">{planet.name}</h1>
            <div className={styles.detail}>
              <table className={styles.data}>
                <tbody>
                  <tr>
                    <th>Rotation Period</th>
                    <td>:</td>
                    <td>{planet.rotation_period}</td>
                  </tr>
                  <tr>
                    <th>Orbital Period</th>
                    <td>:</td>
                    <td>{planet.orbital_period}</td>
                  </tr>
                  <tr>
                    <th>Diameter</th>
                    <td>:</td>
                    <td>{planet.diameter}</td>
                  </tr>
                  <tr>
                    <th>Climate</th>
                    <td>:</td>
                    <td>{planet.climate}</td>
                  </tr>
                  <tr>
                    <th>Gravity</th>
                    <td>:</td>
                    <td>{planet.gravity}</td>
                  </tr>
                  <tr>
                    <th>Terrain</th>
                    <td>:</td>
                    <td>{planet.terrain}</td>
                  </tr>
                  <tr>
                    <th>Surface Water</th>
                    <td>:</td>
                    <td>{planet.surface_water}</td>
                  </tr>
                  <tr>
                    <th>Population</th>
                    <td>:</td>
                    <td>{planet.population}</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>:</td>
                    <td>{formatDate(planet.created)}</td>
                  </tr>
                  <tr>
                    <th>Edited</th>
                    <td>:</td>
                    <td>{formatDate(planet.edited)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <button
                onClick={handleWishlistClick}
                className={
                  isPlanetInWishlist ? styles.removeFromWishlistButton : styles.addToWishlistButton
                }
              >
                {isPlanetInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <button className={styles.returnButton}>
                <Link href="/planet/list">Return to Planet List</Link>
              </button>
            </div>
          </>
        )}
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

export default Detail;
