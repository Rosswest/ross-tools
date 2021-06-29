export class Explanation {
    public static readonly CONVEX_HULL: string = 'The convex hull is a set of points which, when taken as a polygon, fully encompass all other points in the set. Further, all interior angles between \
                                                    the lines in the polygon must not be greater than 180 degrees.';
    public static readonly CONVEX_HULL_BRUTE_FORCE: string = 'The \'brute force\' algorithm compares each possible point pair and determines whether \
                                                            each line is part of the convex hull. This is quite simple - a line which is part of the hull \
                                                            will always have points in only one of clockwise or counter-clockwise orientations. To visualize this, \
                                                            imagine yourself standing on the start point of the line looking towards the end point. If there are only points \
                                                            to your left or right, then that line is on the convex hull.';
    public static readonly CONVEX_HULL_QUICK_HULL: string = 'The quick hull is a slightly more complex algorithm which recursively homes in on the convex hull from an initial shape. \
                                                            The initial convex hull starts as a line between the left-most and right-most points. From here, the shape is iteratively expanded \
                                                            by looking for candidates in the clock-wise and counter-clockwise orientations of the line. The most distant point from the line is used \
                                                            as a new point on the convex hull. Another iteration occurs with the two lines formed from this new point on the hull and its clockwise/counter-clockwise points \
                                                            (excluding those within the new hull shape, which can be safely discounted) until there are no more points to consider.';
    public static readonly CONVEX_HULL_DIVIDE_AND_CONQUER: string = 'The divide and conquer algorithm groups our x-sorted points into small enough clusters where they can be calculated via brute-force \
                                                                without worrying about any excessive overhead. The convex hull is calculated for each of these small clusters, before merging each adjacent hull into \
                                                                the next until we have a full convex hull for the initial set of points. The hulls are merged by finding the upper and lower tangents for the two smaller hulls, \
                                                                i.e. a line which is collinear to one point on each hull, and is either above (upper) or below (lower) the rest of the points on both hulls. The points these lines \
                                                                bypass on each hull are then removed and the remaining points taken to be the convex hull.';
    public static readonly CONVEX_HULL_GRAHAM_SCAN: string = 'The graham scan operates on a relatively simple principle - once we hit upon a point on the convex hull, the point with the lowest polar angle relative to it will be next in the chain. \
                                                                This iteration is done until we arrive back where we started, forming the complete convex hull.';
    public static readonly POLYGON_TRIANGULATION: string = '';
    public static readonly VORONOI_DIAGRAM: string = '';
    public static readonly LARGEST_EMPTY_CIRCLE: string = '';                              
    public static readonly TEST: string = 'Not a real calculation';
}