/* eslint-disable @typescript-eslint/no-explicit-any */


export function CalculateRating(rateList:any) {
    const allreview = rateList ? rateList : [];
    let totalRating = 0;
    let sumOfRating = 0;
    allreview.forEach((element:{reviewRate:number}) => {
      sumOfRating += element.reviewRate;
      totalRating++;
    });
    const reviewRate = sumOfRating /  totalRating;
    return reviewRate
}