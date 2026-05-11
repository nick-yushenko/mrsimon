namespace MrSimon.Api.Dtos.Common;

public class PagedResult<T> : IPagedResult
{
    public List<T> Items { get; set; } = [];

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

    public int TotalPages { get; set; }

    public object GetItems()
    {
        return Items;
    }

    public PageMeta GetMeta()
    {
        return new PageMeta
        {
            Page = Page,
            PageSize = PageSize,
            TotalCount = TotalCount,
            TotalPages = TotalPages,
        };
    }
}
