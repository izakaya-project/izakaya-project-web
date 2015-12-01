class UA {
  constructor() {
    this.userAgent = window.navigator.userAgent.toLowerCase();
  }

  lteIE9() {
    return document.uniqueID && typeof window.matchMedia === 'undefined';
  }

  isIE10() {
    return document.uniqueID && document.documentMode === 10;
  }

  isIPhone() {
    if (this.userAgent.match(/iPhone/i)) {
      return true;
    }

    return false;
  }

  isIPad() {
    if (this.userAgent.match(/iPad/i)) {
      return true;
    }

    return false;
  }

  isAndroid() {
    if (this.userAgent.match(/Android/i)) {
      return true;
    }

    return false;
  }

  isTablet() {
    if((this.userAgent.match(/Android/i) && !this.userAgent.match(/Mobile/i)) ||
      this.userAgent.match(/iPad/i)) {
      //console.log('tablet');
      return true;
    }

    return false;
  }

  isSmartPhone() {
    if ((this.userAgent.match(/iPhone/i) && !this.userAgent.match(/iPad/i)) ||
      (this.userAgent.match(/iPod/i)) ||
      (this.userAgent.match(/Android/i) && this.userAgent.match(/Mobile/i))) {
      return true;
    }

    return false;
  }
}

export default new UA();
