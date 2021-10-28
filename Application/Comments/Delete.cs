using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid ActivityId { get; set; }
            public int CommentId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(x => x.Comments)
                    .SingleOrDefaultAsync(x => x.Id == request.ActivityId);
                var comment = await _context.Comments
                    .Include(x => x.Author)
                    .SingleOrDefaultAsync(x => x.Id == request.CommentId);
                if (activity == null || comment == null) return null;

                if (comment.Author?.UserName == _userAccessor.GetUsername())
                {
                    //user can delete comment
                    activity.Comments.Remove(comment);
                    var success = await _context.SaveChangesAsync() > 0;
                    if (success) return Result<Unit>.Success(Unit.Value);
                    return Result<Unit>.Failure("Failed to delete comment");
                }

                return Result<Unit>.Failure("Cannot delete other user's comments");
            }
        }
    }
}