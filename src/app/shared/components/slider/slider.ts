export interface SliderOptions {
  initialSlide?: Number;
  direction?: String;
  speed?: Number;
  setWrapperSize?: Boolean;
  virtualTranslate?: Boolean;
  width?: Number;
  height?: Number;
  autoHeight?: Boolean;
  roundLengths?: Boolean;
  nested?: Boolean;
  autoplay?: Number;
  autoplayStopOnLast?: Boolean;
  autoplayDisableOnInteraction?: Boolean;
  watchSlidesProgress?: Boolean;
  watchSlidesVisibility?: Boolean;
  freeMode?: Boolean;
  freeModeMomentum?: Boolean;
  freeModeMomentumRatio?: Number;
  freeModeMomentumVelocityRatio?: Number;
  freeModeMomentumBounce?: Boolean;
  freeModeMomentumBounceRatio?: Number;
  freeModeMinimumVelocity?: Number;
  freeModeSticky?: Boolean;
  effect?: String;
  fade?: Object;
  cube?: Object;
  coverflow?: Object;
  flip?: Object;
  parallax?: Boolean;
  spaceBetween?: Number;
  slidesPerView?: Number | String;
  slidesPerColumn?: Number;
  slidesPerColumnFill?: String;
  slidesPerGroup?: Number;
  centeredSlides?: Boolean;
  slidesOffsetBefore?: Number;
  slidesOffsetAfter?: Number;
  grabCursor?: Boolean;
  touchEventsTarget?: String;
  touchRatio?: Number;
  touchAngle?: Number;
  simulateTouch?: Boolean;
  shortSwipes?: Boolean;
  longSwipes?: Boolean;
  longSwipesRatio?: Number;
  longSwipesMs?: Number;
  followFinger?: Boolean;
  onlyExternal?: Boolean;
  threshold?: Number;
  touchMoveStopPropagation?: Boolean;
  iOSEdgeSwipeDetection?: Boolean;
  iOSEdgeSwipeThreshold?: Number;
  touchReleaseOnEdges?: Boolean;
  passiveListeners?: Boolean;
  resistance?: Boolean;
  resistanceRatio?: Number;
  preventClicks?: Boolean;
  preventClicksPropagation?: Boolean;
  slideToClickedSlide?: Boolean;
  allowSwipeToPrev?: Boolean;
  allowSwipeToNext?: Boolean;
  noSwiping?: Boolean;
  noSwipingClass?: String;
  swipeHandler?: String | HTMLElement;
  uniqueNavElements?: Boolean;
  pagination?: String | HTMLElement;
  paginationType?: String;
  paginationHide?: Boolean;
  paginationClickable?: Boolean;
  paginationElement?: String;
  nextButton?: String | HTMLElement;
  prevButton?: String | HTMLElement;
  scrollbar?: String | HTMLElement;
  scrollbarHide?: Boolean;
  scrollbarDraggable?: Boolean;
  scrollbarSnapOnRelease?: Boolean;
  a11y?: Boolean;
  prevSlideMessage?: String;
  nextSlideMessage?: String;
  firstSlideMessage?: String;
  lastSlideMessage?: String;
  paginationBulletMessage?: String;
  keyboardControl?: Boolean;
  mousewheelControl?: Boolean;
  mousewheelForceToAxis?: Boolean;
  mousewheelReleaseOnEdges?: Boolean;
  mousewheelInvert?: Boolean;
  mousewheelSensitivity?: Number;
  mousewheelEventsTarged?: String | HTMLElement;
  hashnav?: Boolean;
  hashnavWatchState?: Boolean;
  history?: String;
  replaceState?: Boolean;
  preloadImages?: Boolean;
  updateOnImagesReady?: Boolean;
  lazyLoading?: Boolean;
  lazyLoadingInPrevNext?: Boolean;
  lazyLoadingInPrevNextAmount?: Number;
  lazyLoadingOnTransitionStart?: Boolean;
  loop?: Boolean;
  loopAdditionalSlides?: Number;
  loopedSlides?: Number;
  zoom?: Boolean;
  zoomMax?: Number;
  zoomMin?: Number;
  zoomToggle?: Boolean;
  controlInverse?: Boolean;
  controlBy?: String;
  normalizeSlideIndex?: Boolean;
  observer?: Boolean;
  observeParents?: Boolean;
  breakpoints?: Object;
  runCallbacksOnInit?: Boolean;
  containerModifierClass?: String;
  slideClass?: String;
  slideActiveClass?: String;
  slideDuplicatedActiveClass?: String;
  slideVisibleClass?: String;
  slideDuplicateClass?: String;
  slideNextClass?: String;
  slideDuplicatedNextClass?: String;
  slidePrevClass?: String;
  slideDuplicatedPrevClass?: String;
  wrapperClass?: String;
  bulletClass?: String;
  bulletActiveClass?: String;
  paginationHiddenClass?: String;
  paginationCurrentClass?: String;
  paginationTotalClass?: String;
  paginationProgressbarClass?: String;
  paginationClickableClass?: String;
  paginationModifierClass?: String;
  buttonDisabledClass?: String;
  lazyLoadingClass?: String;
  lazyStatusLoadingClass?: String;
  lazyStatusLoadedClass?: String;
  lazyPreloaderClass?: String;
  preloaderClass?: String;
  zoomContainerClass?: String;
  notificationClass?: String;
}
