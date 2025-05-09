
export interface Review {
  id: string;
  hostelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    hostelId: "1",
    userId: "user1",
    userName: "Rahul Sharma",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    date: "2023-12-15",
    content: "Excellent hostel with great amenities. The rooms are clean and spacious. Staff is very helpful. Location is perfect, just 5 minutes from campus."
  },
  {
    id: "2",
    hostelId: "1",
    userId: "user2",
    userName: "Priya Patel",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    date: "2023-11-20",
    content: "Really good place to stay. The food is decent and rooms are well maintained. Internet could be faster though, especially during peak hours."
  },
  {
    id: "3",
    hostelId: "1",
    userId: "user3",
    userName: "Aditya Singh",
    userAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 5,
    date: "2023-10-05",
    content: "One of the best hostels near Delhi University. Friendly environment, good security, and the mess food is surprisingly good. Highly recommended!"
  },
  {
    id: "4",
    hostelId: "2",
    userId: "user4",
    userName: "Neha Gupta",
    userAvatar: "https://randomuser.me/api/portraits/women/17.jpg",
    rating: 4,
    date: "2023-12-10",
    content: "Very nice accommodation with all the facilities. The rooms are spacious and clean. The location is perfect for IIT students."
  },
  {
    id: "5",
    hostelId: "2",
    userId: "user5",
    userName: "Vikram Malhotra",
    userAvatar: "https://randomuser.me/api/portraits/men/79.jpg",
    rating: 5,
    date: "2023-11-15",
    content: "The PG is well maintained and has a homely environment. Food quality is excellent and the staff is very cooperative."
  },
  {
    id: "6",
    hostelId: "3",
    userId: "user6",
    userName: "Anjali Desai",
    userAvatar: "https://randomuser.me/api/portraits/women/90.jpg",
    rating: 4,
    date: "2023-11-28",
    content: "Affordable and decent apartment. Good for students who prefer privacy and independence. The only downside is that it's a bit far from the metro station."
  },
  {
    id: "7",
    hostelId: "4",
    userId: "user7",
    userName: "Rajesh Kumar",
    userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
    date: "2023-12-05",
    content: "Top-notch facilities! The gym and gaming zone are great for unwinding after classes. The shuttle service to campus is very convenient."
  },
  {
    id: "8",
    hostelId: "5",
    userId: "user8",
    userName: "Meera Joshi",
    userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 4,
    date: "2023-10-20",
    content: "Perfect for serious students. The study environment is very conducive. Room facilities are decent and the food is good."
  },
  {
    id: "9",
    hostelId: "6",
    userId: "user9",
    userName: "Kabir Mehra",
    userAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 5,
    date: "2023-12-01",
    content: "Luxury living at its best! Everything is well thought out and the community events are a great way to network with like-minded students."
  },
  {
    id: "10",
    hostelId: "6",
    userId: "user10",
    userName: "Sanya Kapoor",
    userAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 4,
    date: "2023-11-10",
    content: "The co-living space is beautiful but slightly overpriced. The facilities and location make up for it though. Great for students who value aesthetics and comfort."
  }
];

export const getReviewsByHostelId = (hostelId: string) => {
  return reviews.filter(review => review.hostelId === hostelId);
};
