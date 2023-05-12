import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Suspense, lazy } from 'react';

import './styles/globalStyles.scss'



//components
import Nav from './components/Nav'
import Footer from './components/Footer'
import PromotionPopup from './components/PromotionPopup';
import Token from './components/Token'
import ContactUs from './components/ContactUs'
import PrivateRoute from 'components/PrivateRoute';
import CourseRoute from 'components/CourseRoute';
import Spinner from 'components/Spinner'

//pages
import Home from './pages/home'
const Checkout = lazy(() => import('./pages/checkout'));
const Cart = lazy(() => import('./pages/Cart'));
const Course = lazy(() => import('./pages/Course'));
const CheckoutFinished = lazy(() => import("pages/CheckoutFinished"));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const BrandStory = lazy(() => import('pages/BrandStory'));
const FrequentlyAsked = lazy(() => import('pages/FrequentlyAsked'));
const CoursesExplore = lazy(() => import('pages/CoursesExplore'))
const FavouriteCourses = lazy(() => import("pages/FavouriteCourses"));
const PurchaseRecord = lazy(() => import("pages/PurchaseRecord"));
const Lesson = lazy(() => import('pages/Lesson'));
const Inbox = lazy(() => import('pages/Inbox'));
const Quiz = lazy(() => import("pages/Quiz"));
const EnrolledCourses = lazy(() => import("pages/EnrolledCourses"));
const Certificate = lazy(() => import("pages/Certificate"));
const Profile = lazy(() => import('pages/Profile'));
const sharedCertificate = lazy(() => import('pages/SharedCertificate'));
const PriceChanged = lazy(() => import('pages/PriceChanged'));


function App() {

  return (
    <Router>
      <div className="App">
        <PromotionPopup />
        <Token />
        <Nav />
        <div className={window.location.pathname.startsWith('/certificate') ? 'noMargin' : 'main'}>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path="/cart" exact component={Cart} />
              <Route path="/checkout" exact component={Checkout} />
              <Route path='/checkout-finished' exact component={CheckoutFinished} />
              <Route path='/price-changed' exact component={PriceChanged} />
              <CourseRoute path='/courses/:id' exact component={Course} />
              <CourseRoute path='/courses/:id/lessons/:lesson_id' exact component={Lesson} />
              <PrivateRoute path='/profile/purchase-records' exact component={PurchaseRecord} />
              <PrivateRoute path="/profile/enrolled-courses" exact component={EnrolledCourses} />
              <PrivateRoute path='/profile/certificate' exact component={Certificate} />
              <PrivateRoute path='/profile' exact component={Profile} />
              <Route path='/reset-password/:token' exact component={ResetPassword} />
              <Route path="/contact-us" exact component={ContactUs} />
              <Route path="/terms" exact component={Terms} />
              <Route path="/privacy" exact component={Privacy} />
              <Route path="/brand-story" exact component={BrandStory} />
              <Route path='/frequently-asked' exact component={FrequentlyAsked} />
              <Route path='/courses' exact component={CoursesExplore} />
              <PrivateRoute path='/favourite' exact component={FavouriteCourses} />
              <PrivateRoute path='/inbox' exact component={Inbox} />
              <PrivateRoute path='/quiz/:course_id' exact component={Quiz} />
              <Route path='/certificate/:token' exact component={sharedCertificate} />
              {/* Default Route */}
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
