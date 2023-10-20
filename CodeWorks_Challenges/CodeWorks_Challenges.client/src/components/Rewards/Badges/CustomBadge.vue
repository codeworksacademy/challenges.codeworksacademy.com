<template>
  <section class="container-fluid position-relative">
    <div class="background-box m-auto">
      <div class="img-box m-auto">
        <img src="../../../assets/img/ultimate-hacker.png" alt="Ultimate Hacker Badge Image">
        <img src="../../../assets/img/gold-ribbon.png" alt="Small Gold Ribbon Image" class="gold-ribbon">
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
  width: 300px;
  height: 300px;
  padding: 50px 200px 0 150px;
  background-image: url(../../../assets/img/bg-custom-badge.png);
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .img-box {
    position: relative;
    padding: 0;
    margin: 0;
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    z-index: 1000;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-clip: border-box;
      background: conic-gradient(
        #222222 0% 2.5%,
        var(--primary-green) 2.5% 7.5%,
        #222222 7.5% 10%,
        var(--primary-blue) 10% 15%,
        #222222 15% 17.5%,
        var(--secondary-magenta) 17.5% 22.5%,
        #222222 22.5% 25%,
        var(--tertiary-orange) 25% 30%,
        #222222 30% 32.5%,
        var(--primary-green) 32.5% 37.5%,
        #222222 37.5% 40%,
        var(--primary-blue) 40% 45%,
        #222222 45% 47.5%,
        var(--secondary-magenta) 47.5% 52.5%,
        #222222 52.5% 55%,
        var(--tertiary-orange) 55% 60%,
        #222222 60% 62.5%,
        var(--primary-green) 62.5% 67.5%,
        #222222 67.5% 70%,
        var(--primary-blue) 70% 75%,
        #222222 75% 77.5%,
        var(--secondary-magenta) 77.5% 82.5%,
        #222222 82.5% 85%,
        var(--tertiary-orange) 85% 90%,
        #222222 90% 92.5%,
        var(--primary-green) 92.5% 97.5%,
        #222222 97.5% 100%,
        );
      clip-path: path('M100 0 L200 35 Q190 175 100 200 Q10 175 0 35 L100 0');
      transition: .5s;
      z-index: 0;
      transform: scale(1.1);
      filter: brightness(.8);
    }
    &:after {
      background: conic-gradient(
        #222222 0%,
        var(--primary-green) 25%,
        var(--primary-blue) 50%,
        var(--secondary-magenta) 75%,
        #222222 100%,
      );
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      clip-path: path('M100 0 L200 35 Q190 175 100 200 Q10 175 0 35 L100 0');
      transition: .5s;
      transform: scale(1);
      opacity: .25;
      z-index: 1;
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
}

</style>