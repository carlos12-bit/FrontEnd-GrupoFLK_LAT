<template>
  <navbar></navbar>
    <Jumbotron />
    <Certifications />
    <Services />
    <WhyChooseUs />
    <CarouselSection />
    <FAQSection />
    <FooterSection />
    <RequestTraining/>
</template>

<script>
import Navbar from '@/components/Website/Navbar.vue';
import Jumbotron from '@/components/Website/Home/Jumbotron.vue';
import CarouselSection from '@/components/Website/Home/CarouselSection.vue';
import Certifications from '@/components/Website/Home/Certifications.vue';
import WhyChooseUs from '@/components/Website/Home/WhyChooseUs.vue';
import FAQSection from '@/components/Website/Home/FAQSection.vue';
import FooterSection from '@/components/Website/Home/FooterSection.vue';
import Services from '@/components/Website/Home/Services.vue';
//import RequestTraining from '@/components/Website/Home/RequestTraining.vue';
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
    Services,
    //RequestTraining
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
}
</style>
