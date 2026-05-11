namespace MrSimon.Api.Dtos.Common;

public interface IPagedResult
{
    object GetItems();

    PageMeta GetMeta();
}
