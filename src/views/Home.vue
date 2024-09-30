<template>
  <navbar></navbar>
    <Jumbotron />
    <Certifications />
    <Services />
    <WhyChooseUs />
    <CarouselSection />
    <FAQSection />
    <FooterSection />
</template>

<script>
import Navbar from '@/components/Home/Navbar.vue';
import Jumbotron from '@/components/Home/Jumbotron.vue';
import CarouselSection from '@/components/Home/CarouselSection.vue';
import Certifications from '@/components/Home/Certifications.vue';
import WhyChooseUs from '@/components/Home/WhyChooseUs.vue';
import FAQSection from '@/components/Home/FAQSection.vue';
import FooterSection from '@/components/Home/FooterSection.vue';
import Services from '@/components/Home/Services.vue';
export default {
  name: 'Home',
  components: {
    Navbar,
    Jumbotron,
    CarouselSection,
    Certifications,
    WhyChooseUs,
    FAQSection,
    FooterSection,
    Services
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
