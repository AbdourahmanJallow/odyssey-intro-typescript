import { RESTDataSource } from '@apollo/datasource-rest';
import { Listing, Amenity, CreateListingInput } from '../types';
import DataLoader from 'dataloader';

export class ListingAPI extends RESTDataSource {
  baseURL = 'https://rt-airlock-services-listing.herokuapp.com/';

  private batchedAmenities = new DataLoader(
    async (listingIds: string[]): Promise<Amenity[][]> => {
      console.log('Making one batch call with ', listingIds);

      const amenities = await this.get<Amenity[][]>('amenities/listings', {
        params: { ids: listingIds.join(',') },
      });

      // console.log(amenities);

      return amenities;
    }
  );

  getFeaturedListings(): Promise<Listing[]> {
    return this.get<Listing[]>('featured-listings');
  }

  getListing(listingId: string): Promise<Listing> {
    return this.get<Listing>(`listings/${listingId}`);
  }

  getAmenities(listingId: string): Promise<Amenity[]> {
    +console.log('Passing listing ID to the data loader: ', listingId);
    // return this.get<Amenity[]>(`listings/${listingId}/amenities`);

    return this.batchedAmenities.load(listingId);
  }

  createListing(listing: CreateListingInput): Promise<Listing> {
    return this.post<Listing>('listings', {
      body: { listing },
    });
  }
}
