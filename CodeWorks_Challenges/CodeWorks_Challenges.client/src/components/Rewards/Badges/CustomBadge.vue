<template>
  <section class="container-fluid position-relative p-3">
    <div class="background-box m-auto">
      <div class="img-box m-auto">
        <img src="../../../assets/img/ultimate-hacker.png" alt="Ultimate Hacker Badge Image" style="filter: brightness(1.2);">
        <img src="../../../assets/img/gold-ribbon.png" alt="Small Gold Ribbon Image" class="gold-ribbon">
        <svg viewBox="0 0 500 500">
          <defs>
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: #FFD700; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: #FFA500; stop-opacity: 1">
                <animate
                  attributeName="stop-color"
                  values="#FFD700; white; #FFA500"
                  dur="3s"
                  repeatCount="once"
                />
              </stop>
            </linearGradient>
          </defs>
          <path
            id="curve"
            d="M0 140 C200 300 300 50 500 150"
            stroke-width="50"
            stroke="url(#ribbonGradient)"
          />
          <text width="500">
            <textPath
              xlink:href="#curve"
              startOffset="50%"
              text-anchor="middle"
              fill="black"
              stroke="var(--primary-blue)"
              stroke-opacity=".3"
            >
              Founder of 'App Name'
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  </section>
  
</template>

<script>

export default {

  setup() {

    return {

    } 
  }
}
</script>

<style scoped lang="scss">
.background-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  min-height: 350px;
  background-image: url(../../../assets/img/bg-custom-badge.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  filter: drop-shadow(2px 1px 5px #222222);
  z-index: 100;
  transform: scale(.75);
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    clip-path: path('M150 25 L300 85 Q290 285 150 325 Q10 275 0 85 L150 25');
    background-color: #11111199 !important;
    background: radial-gradient(
      circle at 50% 50%,
      transparent 0% 10%,
      transparent 25%,
      #11111199 50% 51%,
      #21221299 51% 52%,
      transparent 80% 100%
    );
    background-size: 400% 400%;
    opacity: .5;
    z-index: 0;
    animation: shimmerBackground 3s ease-in-out 5s forwards;
    transform: scale(.9);
  }

  @keyframes shimmerBackground {
    0% {
      background-position: 0% 0%;
      background-size: 400% 400%;
    }
    50% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -200% -200%;
      background-size: 400% 400%;
      background-color: #11111199;
    }
  }
  .img-box {
    position: relative;
    padding: 0;
    margin: 0;
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    z-index: 1;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-clip: border-box;
      background: conic-gradient(
        transparent 0% 2.5%,
        var(--primary-green) 2.5% 7.5%,
        transparent 7.5% 10%,
        var(--primary-blue) 10% 15%,
        transparent 15% 17.5%,
        var(--secondary-magenta) 17.5% 22.5%,
        transparent 22.5% 25%,
        var(--tertiary-orange) 25% 30%,
        transparent 30% 32.5%,
        var(--primary-green) 32.5% 37.5%,
        transparent 37.5% 40%,
        var(--primary-blue) 40% 45%,
        transparent 45% 47.5%,
        var(--secondary-magenta) 47.5% 52.5%,
        transparent 52.5% 55%,
        var(--tertiary-orange) 55% 60%,
        transparent 60% 62.5%,
        var(--primary-green) 62.5% 67.5%,
        transparent 67.5% 70%,
        var(--primary-blue) 70% 75%,
        transparent 75% 77.5%,
        var(--secondary-magenta) 77.5% 82.5%,
        transparent 82.5% 85%,
        var(--tertiary-orange) 85% 90%,
        transparent 90% 92.5%,
        var(--primary-green) 92.5% 97.5%,
        transparent 97.5% 100%,
        );
      clip-path: path('M100 0 L200 35 Q190 175 100 200 Q10 175 0 35 L100 0');
      transition: .5s;
      z-index: 2;
      transform: scale(1.1);
      filter: brightness(.8);
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: conic-gradient(
        #222222 0%,
        var(--primary-green) 25%,
        var(--primary-blue) 50%,
        var(--secondary-magenta) 75%,
        #222222 100%,
      );
      clip-path: path('M100 0 L200 35 Q190 175 100 200 Q10 175 0 35 L100 0');
      transition: .5s;
      transform: scale(1.1);
      opacity: .7;
      z-index: 1;
      filter: brightness(.8) saturate(1.2) grayscale(.75);
    }
    img {
      position: relative;
      width: 200px;
      height: 200px;
      object-fit: cover;
      object-position: center;
      cursor: pointer;
      transition: .5s;
      clip-path: path('M100 0 L200 35 Q190 175 100 200 Q10 175 0 35 L100 0');
      z-index: 2;
  
    }
    .gold-ribbon {
      position: absolute;
      top: 3.5rem;
      left: 3.5rem;
      right: 0;
      bottom: 0;
      clip-path: path('M100 0 L200 35 Q190 175 100 200 Q10 175 0 35 L100 0');
      transition: .5s;
      transform: scale(.4) rotate(-15deg);
      filter: drop-shadow(0 3px 5px goldenrod) brightness(.9);
      z-index: 4;
    }
  }
  svg {
    position: relative;
    left: 0;
    right: 0;
    bottom: 14rem;
    width: 200px;
    height: 200px;
    transition: .5s;
    transform: scale(1.1);
    z-index: 3;
    fill: transparent;
    animation: translateRibbon 1s ease-in-out forwards;
    stroke-dasharray: 0 1000;
    animate {
      stroke-dasharray: 1000 0;
      
    }
    text {
      font-family: 'Lobster';
      stroke-width: 1px;
      font-size: 2.2rem;
      font-weight: 550;
      text-align: center;
      text-transform: uppercase;
      transform: translateY(.75rem);
      text-shadow: 0 .5px .5px #fff;
      letter-spacing: 0px;
      visibility: hidden;
      animation: translateText .5s ease-in-out 1s forwards !important;
    }
  }

  @keyframes translateText {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
      visibility: visible;
    }
  }

  @keyframes translateRibbon {
    0% {
      stroke-dasharray: 0 1000;
      stroke-opacity: .5;
    }
    100% {
      stroke-dasharray: 1000 0;
      stroke-opacity: 1;
    }
  }
}

</style>