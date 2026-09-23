/**
 * Vince's photographs. Originals live in photo-originals/ (gitignored);
 * these are 2400px webp masters that next/image resizes per breakpoint.
 * Regenerate with scripts/process-photos.mjs.
 */
export type Photo = {
  slug: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const PHOTOS = [
  {
    "slug": "storefront-wide",
    "alt": "The shop from across Sycamore Street, under a blue sky",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAACQAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JaAC7ACFJ4ZbkzwOwAP39HiHzARnjsSJHVwTPQbOooNOvJ16u9/VYxz3u7eSZkns+j2qdXTM7bhNkblxYKTR/Nu1/jCME+3287m2UMbSmNTum+Q0uBHfnwAA="
  },
  {
    "slug": "storefront-front",
    "alt": "The front of the shop, burlap shade over tables of plants",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JbACw7YwIuek82LUsuV33wADL9ml54CTkPyZqr+jtqB1v39vTreXitArOhZIycaa2HlwqDHGaUoVWg8tX9ybbdmEs6QRSkGhgFSgXFQUeQS5hwi5AJsd9WQcRtAmg8/ITlMfCUqTF2BJ1i1JlbRz/vSxQ//h7VtaRcv5cQlkpcw5ZLjtkAA=="
  },
  {
    "slug": "studio-interior",
    "alt": "Inside the shop, painted canvases along the counter",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAACQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JbACdMoR4GB9uyoqA7mRSGwc4/AAA/qWDnKMaLcJKUvbUyCosaCPE6tkgVwG7yVdXcd5tOuIIV9yXw1UuNp3WFR4KU4N6/+qZR54mNesTxjX6h7auJtLOqTwvwezKWzQE9MUNls+iLOwqUXb6B4+Ml+seJJRbLSeG5bx79+AAAA=="
  },
  {
    "slug": "art-panels",
    "alt": "Tall painted panels hanging in the shop",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAADwBACdASoQABUAPu1iqU2ppaOiMAgBMB2JbACdMoLUChM7MvAg4QFxszxw+1MF9AAA/td8Q7VdLgkiE91Ly0bcN0Bka04/RTYYoHUf0IoZhqeNJau/ehpeIHJu/zPHhAVzHwp3tVjMI1p8bbLQhQZEoPeTqUE/rA+6toaJKSxleaJIlFnx1/g5lomMv+cgqlnsrsSnDrrCQ+7CwHe8VW/pdo+vKP9+RB/BvvxfM/iDCCODkmjhHRhIAAA="
  },
  {
    "slug": "art-canvases",
    "alt": "Painted canvases leaning along the wood wall",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAADwBACdASoQABUAPu1iqU2ppaOiMAgBMB2JbACdMoR3A8AjnM+ALei7ew3YNWV3fgAA9m3WqzWpDqskfbehR5C0EDkjUH200kT23oZtr/ekW6l+5xuq5Q/6/t1YJApc56w2bdO+v6lx/rrLTqPAVYT3Nd4I7VHrVkdY1i1Eo9hbXH26qnx5m4Ng7J9RFhAayTTI6lAHf6ydaDg/iUOHjr9i0ztzXAaE/zkrfEt1JPqjeGjHcAAAAA=="
  },
  {
    "slug": "cooler-doors",
    "alt": "The cooler, anemones and hydrangea behind glass",
    "width": 1819,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAADwAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JagCdAB6wvDA6N4MUHZjQAMyDtHTOFPfzOn/mHnNh1lbVj7+D2sV6fp0cO5OPFK7q35AEP+13v+3JAs6TCsG+8kzjOerSIkGfD3V1t65l4A2+U9cBtfxDbPlkXLNZS2hjXMwXiIr+DEFpGdgSPKD6lybqAAAA"
  },
  {
    "slug": "cooler-wide",
    "alt": "The cooler, roses and banksia on the shelves",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAAAwBACdASoQABUAPu1iqU2ppaOiMAgBMB2JaACdMoAvQTPQexUxczqUVgAA/mVQe7STrPjXafN5+Tl70NrhGXkuUdqCUMvgA/uuRIfhT/QyHf3+Y1WkXjm3KubEG7SQBv9jHJmK3KxjChe9/uOyAM1NSHzbQ+oWamZM0P19K6VuTl80oPixt09yh1UaPVDX+T9iXf83s9mblSCLtsAMajX3iunPYLL2IAA="
  },
  {
    "slug": "roses-green-trick",
    "alt": "Peach and magenta roses beside green trick dianthus",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRtIAAABXRUJQVlA4IMYAAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JbACdL1ABfIkr81mrc2bEAAD+CG1maimxf7BtUHcWxnRqf1vjcrdLekIFDDHMmwy5q910hYWSTuK9VU4UwM2sHxk5UzTQVsv8jeD3votm8G2DwB2LdfHww5BhiiKZmQ6ZRU8SM/9obwFFqKWnGwPrCX6/vUr7FBH2a1sfjkfed9cjwfC2Z2tut1vLZaLpa9/xn7zWkLSxGk6wmXZ80dDz/5/4Qmm9lyL6//uAAAA="
  },
  {
    "slug": "roses-hellebore",
    "alt": "Coral roses, hellebore and bells of Ireland in the cooler",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAADQAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JbACsACHe/dYn158y8oAA/mi03ptsCmYMuVJBIHVe+YIIBCJZYallxmZAYCJEwIrGC2n541mkUb5eK8G1oGCeHQ7YkWxzI9kRmLScveJ5vtpy3Mt2c8bPu+Q6NQgrQ1PxPka9Zjs1y1ZTDQY+8YO+IeYnS4d+V4/EhTmbAKgQAA=="
  },
  {
    "slug": "succulent-patio",
    "alt": "The succulent tables out back, under shade cloth",
    "width": 1800,
    "height": 2400,
    "blurDataURL": "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JYgCsAYwcjC+huN1LPAPuAAD91RebrPOtw61KR/Q8C50XsOX+y8UmFgHxVa9BsV70BG6MDhMvi5dqMArfeB/T/dn0kQDKqNqTKE2Zt3PKsW0P3QBNotM0mtVFx2uW9SilCQ3r40yugiz4Sp+EjVeAAAA="
  }
] as const satisfies readonly Photo[];

export type PhotoSlug = (typeof PHOTOS)[number]['slug'];

const BY_SLUG = new Map(PHOTOS.map((p) => [p.slug, p]));

export function photo(slug: PhotoSlug): Photo {
  const found = BY_SLUG.get(slug);
  if (!found) throw new Error(`Unknown photo: ${slug}`);
  return found;
}

export function photoSrc(slug: PhotoSlug) {
  return `/photos/${slug}.webp`;
}
