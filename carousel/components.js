// .prev .current .next


const data = [
  {// .next
    image: 'https://www.wfla.com/wp-content/uploads/sites/71/2020/04/hubble-telescope-photo.jpg?w=811',
    title: 'Title 4',
    description: 'Description 4',
  },
  {
    image: 'https://www.visualcapitalist.com/wp-content/uploads/2020/04/Hubble-Shareable.jpg',
    title: 'Title 5',
    description: 'Description 5',
  },
  {
    image: 'https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F201214080027-hubble-telescope-image.jpg',
    title: 'Title 6',
    description: 'Description 6',
  },
  {
    image: 'https://images.theconversation.com/files/79109/original/image-20150423-25578-10t7t3r.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=496&fit=clip',
    title: 'Title 1',
    description: 'Description 1',
  },
  {// .prev
    image: 'https://mymodernmet.com/wp/wp-content/uploads/2020/12/caldwell-45-nasa-1.jpg',
    title: 'Title 2',
    description: 'Description 2',
  },
  {// .current
    image: 'https://static01.nyt.com/images/2009/09/09/science/09hubble_600.jpg?quality=75&auto=webp&disable=upscale',
    title: 'Title 3',
    description: 'Description 3',
  },
];

class Component {
  constructor(props) {
    this.props = props;
    this.state = null;
  }

  setState(values) {
    this.state = Object.assign(this.state, values);
    this.render();
  }

  setProps(values) {
    this.props = Object.assign(this.props, values);
    this.render();
  }

  init() {
    throw new Error();
  }

  render() {
    throw new Error('');
  }
}

class Spinner extends Component {
  render() {
    const divElem = document.createElement('div');
    divElem.classList.add('loader');
    return divElem;
  }
}

class SlideImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: null,
    };
    this.loadImage();
    this.imgLoader = new Image();
  }

  loadImage = () => {
    const { src } = this.props;
    this.imgLoader.addEventListener('load', () => {
      this.setState({
        loaded: true,
      });
    });
    this.imgLoader.addEventListener('error', () => {
      this.setState({
        error: true,
      });
    });
    this.imgLoader.setAttribute('src', src);
  };

  render() {
    const { src } = this.props;
    const { loaded, error } = this.state;

    if (error) {
      return null;
    }

    if (loaded) {
      const imgElem = document.createElement('img');
      imgElem.setAttribute('src', src);
      return imgElem;
    }

    return new Spinner().render();
  }
}

class Slide extends Component {

  constructor(props) {
    super(props);
    this.init();
  }

  init() {
    const { image, title } = this.props;
    this.elem = document.createElement('div');
    const img = new Image();
    img.src = image;
    img.alt = title;
    this.elem.appendChild(img);
    img.addEventListener('load', () => {
        const { height, width } = img;
        const { clientHeight, clientWidth } = img.parentElement;
        const imgAspectRatio = width / height;
        const imageContainerAspectRatio = clientWidth / clientHeight;
        if (imgAspectRatio < imageContainerAspectRatio) {
          img.height = clientHeight;
        } else {
          img.width = clientWidth;
        }
      },
    );
  }

  render() {
    const { className } = this.props;
    const classes = [className];
    const animate = className.includes('current') || this.elem.classList.contains('current');
    if (animate) {
      classes.push('animation');
    }
    this.elem.setAttribute('class', classes.join(' '));
  }
}

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
    };
    this.init();
  }

  goNext = () => {
    const { slides } = this.props;
    const { currentIndex } = this.state;
    this.setState({
      currentIndex: Carousel.nextIndex(currentIndex, slides.length),
    });
  };

  goPrev = () => {
    const { slides } = this.props;
    const { currentIndex } = this.state;
    this.setState({
      currentIndex: Carousel.prevIndex(currentIndex, slides.length),
    });
  };

  static nextIndex(index, length) {
    return (index + 1) % length;
  };

  static prevIndex(index, length) {
    return (index - 1 + length) % length;
  };

  init() {
    const { slides } = this.props;
    this.children = slides.map((slide) => new Slide({ ...slide }));
    const elems = this.children.map((s) => s.elem);
    document.querySelector('.slides-container').append(...elems);
    const [prevBtn, nextBtn] = document.querySelector('.controls').children;
    prevBtn.addEventListener('click', this.goPrev);
    nextBtn.addEventListener('click', this.goNext);
  }

  render() {
    const { currentIndex } = this.state;
    const { slides } = this.props;
    this.children.forEach((slide, index) => {
      const classes = ['slide'];

      if (index === currentIndex) {
        classes.push('current');
      }
      if (Carousel.nextIndex(currentIndex, slides.length) === index) {
        classes.push('next');
      }
      if (Carousel.prevIndex(currentIndex, slides.length) === index) {
        classes.push('prev');
      }

      if (slide instanceof Component) {
        slide.setProps({
          currentIndex,
          className: classes.join(' '),
        });
      }
    });
  }
}

const carousel = new Carousel({
  slides: data,
});

carousel.render();
